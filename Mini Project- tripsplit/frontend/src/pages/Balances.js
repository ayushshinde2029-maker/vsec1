
import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function Balances() {
    const [data, setData] = useState({
        total: 0,
        share: 0,
        balances: []
    });

    const [error, setError] = useState("");

    const loadBalances = async () => {
        try {
            const response = await fetch(`${API}/balances`);

            if (!response.ok) {
                throw new Error();
            }

            setData(await response.json());
            setError("");
        } catch {
            setError("Could not load balances.");
        }
    };

    useEffect(() => {
        loadBalances();
    }, []);

    return (
        <section className="card">
            <h2>Member Balances</h2>

            {error && <p className="red">{error}</p>}

            <p>Total Expenses: ₹{data.total.toFixed(2)}</p>
            <p>Equal Share: ₹{data.share.toFixed(2)}</p>

            {data.balances.map((b, index) => (
                <div
                    className="balance"
                    key={`${b.name}-${index}`}
                >
                    <div>
                        <strong>{b.name}</strong>
                        <p>Paid ₹{b.paid.toFixed(2)}</p>
                    </div>

                    <strong className={b.balance >= 0 ? "green" : "red"}>
                        {b.balance >= 0 ? "+" : "-"}
                        ₹{Math.abs(b.balance).toFixed(2)}
                    </strong>
                </div>
            ))}

            <p className="note">
                Positive means paid more than their share.
                Negative means paid less.
            </p>
        </section>
    );
}

export default Balances;
