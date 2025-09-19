import { useState } from 'react';
import './homepage.css'


const HomePage = () => {
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState(null);


    //mock ai call
    const handleSubmit = () => {
        // In real app -> call backend Node.js API
        if (description.toLowerCase().includes("student")) {
        setRequirements({
            appName: "Course Manager",
            entities: ["Student", "Course", "Grade"],
            roles: ["Teacher", "Student", "Admin"],
            features: ["Add course", "Enrol students", "View reports"],
        });
        } else {
        setRequirements({
            appName: "My App",
            entities: ["Entity1", "Entity2"],
            roles: ["User", "Admin"],
            features: ["Feature A", "Feature B"],
        });
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

