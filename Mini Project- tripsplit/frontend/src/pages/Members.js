
import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function Members() {
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    async function loadMembers() {
        try {
            const response = await fetch(`${API}/members`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error();
            }

            setMembers(data);
            setError("");
        } catch {
            setError("Could not load members.");
        }
    }

    useEffect(() => {
        loadMembers();
    }, []);

    async function addMember(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/members`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setName("");
            await loadMembers();
        } catch (error) {
            setError(error.message || "Could not add member.");
        }
    }

    return (
        <main>
            <div className="page-heading">
                <div>
                    <h2>Trip Members</h2>
                    <p>Add people who are travelling with you.</p>
                </div>
                <span className="count">{members.length} Members</span>
            </div>

            {error && <p className="error">{error}</p>}

            <section className="card">
                <h3>Add New Member</h3>

                <form onSubmit={addMember} className="member-form">
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter member name"
                        required
                    />
                    <button type="submit">+ Add Member</button>
                </form>
            </section>

            <section className="card">
                <h3>All Members</h3>

                {members.length === 0 && <p>No members added yet.</p>}

                <div className="member-list">
                    {members.map(member => (
                        <div className="member-item" key={member._id}>
                            <div className="avatar">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{member.name}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Members;
