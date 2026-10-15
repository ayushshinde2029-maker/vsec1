
import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function Members() {
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const loadMembers = async () => {
        try {
            const response = await fetch(`${API}/members`);

            if (!response.ok) {
                throw new Error();
            }

            setMembers(await response.json());
            setError("");
        } catch {
            setError("Could not load members.");
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const addMember = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) return;

        try {
            const response = await fetch(`${API}/members`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: trimmedName })
            });

            if (!response.ok) {
                throw new Error();
            }

            setName("");
            await loadMembers();
        } catch {
            setError("Could not add member.");
        }
    };

    return (
        <section className="card">
            <h2>Trip Members</h2>

            {error && <p className="red">{error}</p>}

            <form onSubmit={addMember}>
                <label>Member Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter member name"
                    required
                />

                <button type="submit" disabled={!name.trim()}>
                    Add Member
                </button>
            </form>

            <h3>All Members</h3>

            {members.map((m, index) => (
                <div className="balance" key={`${m}-${index}`}>
                    <strong>{m}</strong>
                </div>
            ))}
        </section>
    );
}

export default Members;
