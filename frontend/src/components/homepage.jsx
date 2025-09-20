import { useState } from 'react';
import './homepage.css'


const HomePage = () => {
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState(null);


    const handleSubmit = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/requirements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description }),
            });

            const data = await res.json();

            // Parse AI JSON response
            // Expected: { "appName": "...", "entities": [...], "roles": [...], "features": [...] }
            const parsed = JSON.parse(data.aiContent);
            setRequirements(parsed);
        } catch (err) {
            console.error(err);
            alert("Failed to get AI requirements");
        }
    };


    return(
        <div>
            <h1>AI App Builder Portal</h1>

            {/* Requirement Capture */}
            <div className="input-section">
                <textarea
                rows={4}
                placeholder="Describe the app you want..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={handleSubmit}>Generate Requirements</button>
            </div>

            {/* Display Extracted Requirements */}
            {requirements && (
                <div className="requirements">
                <h2>Extracted Requirements</h2>
                <p><strong>App Name:</strong> {requirements.appName}</p>
                <p><strong>Entities:</strong> {requirements.entities.join(", ")}</p>
                <p><strong>Roles:</strong> {requirements.roles.join(", ")}</p>
                <p><strong>Features:</strong> {requirements.features.join(", ")}</p>
                </div>
            )}

            {/* Dynamic Mock UI */}
            {requirements && (
                <div className="mock-ui">
                <h2>{requirements.appName} - Mock UI</h2>

                {/* Menu Tabs */}
                <div className="menu">
                    {requirements.roles.map((role) => (
                    <button key={role} className="tab">
                        {role}
                    </button>
                    ))}
                </div>

                {/* Entity Forms */}
                <div className="forms">
                    {requirements.entities.map((entity) => (
                    <div key={entity} className="form-card">
                        <h3>{entity} Form</h3>
                        <form>
                        <input placeholder={`${entity} Field 1`} />
                        <input placeholder={`${entity} Field 2`} />
                        <input placeholder={`${entity} Field 3`} />
                        <button type="button">Submit</button>
                        </form>
                    </div>
                    ))}
                </div>
                </div>
            )}
        </div>
    );

}

export default HomePage;

