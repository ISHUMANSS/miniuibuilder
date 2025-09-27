import { useEffect, useState } from 'react';
import './homepage.css';

const HomePage = () => {
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState(null);

    //state to manage which role ui is currently visible
    const [activeTab, setActiveTab] = useState(null);

    const [loading, setLoading] = useState(false);//loading indicator

    
    const [savedUIs, setSavedUIs] = useState([]);
    const [saving, setSaving] = useState(false);

    /**
     * submit the ui request
     * @returns 
     */
    const handleSubmit = async () => {
        if (!description.trim()) {
            alert("Please enter an app description before submitting.");
            return;
        }

        setLoading(true);
        setRequirements(null);//clear results

        try {
            const res = await fetch("http://localhost:5000/api/requirements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });

            if (!res.ok) {
                 throw new Error(`Server responded with status: ${res.status}`);
            }

            //backend handles the normilazation so none needed here

            const data = await res.json();
            
            setRequirements(data);
            //set the first role as the default active tab
            if (data.roles && data.roles.length > 0) {
                setActiveTab(data.roles[0]);
            }

        } catch (err) {
            console.error(err);
            alert("Failed to get AI requirements. Please check the console and try again.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * save the ui to the db
     * @returns 
     */
    const handleSaveRequirements = async () => {
        if (!requirements) {
            alert("Nothing to save — generate requirements first.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("http://localhost:5000/api/ui", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requirements),
            });
            if (!res.ok) throw new Error("Save failed");
            const data = await res.json();
            alert("Saved! id: " + data.id);
            // refresh saved list
            await fetchSavedUIs();
        } catch (err) {
            console.error(err);
            alert("Failed to save UI.");
        } finally {
            setSaving(false);
        }
    };

    /**
     * get all the saved uis
     */
    const fetchSavedUIs = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/ui");
            if (!res.ok) throw new Error("Failed to fetch saved UIs");
            const list = await res.json();
            setSavedUIs(list);
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * update a ui
     * @param {*} ui 
     * @returns 
     */
    const applySavedUI = (ui) => {
        if (!ui) return;
        setRequirements({
            appName: ui.appName || ui["App Name"] || "Unnamed App",
            roles: ui.roles || ui.Roles || [],
            features: ui.features || ui.Features || [],
            entities: ui.entities || ui.Entities || {},
        });
        if ((ui.roles && ui.roles.length > 0) || (ui.Roles && ui.Roles.length > 0)) {
            setActiveTab((ui.roles && ui.roles[0]) || (ui.Roles && ui.Roles[0]));
        } else {
            setActiveTab(null);
        }
    };


    const getRoleSpecificContent = (role) => {
        if (!requirements) return { entities: {}, features: [] };
        
        //this should seprate what requiremnts are needed by specific roles
        //this will allow diffrent tabs to display diffrent things
        //still needs working

        return {
            entities: requirements.entities || {},
            features: requirements.features || []
        };
    };

    //fetchSavedUIs when component mounts
    useEffect(() => {
        fetchSavedUIs();
    }, []);

    return (
        <div className="app-container">
            <h1>AI App Builder Portal</h1>

            <div className="input-section">
                <textarea
                    rows={4}
                    placeholder="e.g., I want an app to manage student courses and grades. Teachers add courses, students enroll, and admins manage reports."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Generating..." : "Generate Requirements"}
                </button>
            </div>

            {/* Save & saved list area */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div>
                <button onClick={handleSaveRequirements} disabled={saving || !requirements}>
                {saving ? "Saving..." : "Save Requirements"}
                </button>
            </div>

            <div style={{ marginLeft: "auto", width: 320 }}>
                <h4>Saved UIs</h4>
                <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ddd", padding: 8, borderRadius: 6 }}>
                {savedUIs.length === 0 && <p style={{ margin: 0 }}>No saved UIs</p>}
                {savedUIs.map((s) => (
                    <div key={s.id} style={{ padding: 6, borderBottom: "1px solid #eee" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <strong style={{ fontSize: 13 }}>{s.appName || s["App Name"] || "Unnamed"}</strong>
                        <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => applySavedUI(s)}>Apply</button>
                        <button onClick={async () => {
                            // load full from server (optional)
                            try {
                            const res = await fetch(`http://localhost:5000/api/ui/${s.id}`);
                            const full = await res.json();
                            alert("Loaded: " + (full.appName || full["App Name"]));
                            } catch (err) { console.error(err); alert("Failed to load"); }
                        }}>Load</button>
                        </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>{(s.roles || s.Roles || []).join(", ")}</div>
                    </div>
                ))}
                </div>
            </div>
            </div>


             {/*display extracted requirements*/}
            {requirements && (
                <div className="requirements">
                    <h2>Extracted Requirements</h2>
                    <p><strong>App Name:</strong> {requirements.appName}</p>
                    <p><strong>Entities:</strong> {Object.keys(requirements?.entities ?? {}).join(", ")}</p>
                    <p><strong>Roles:</strong> {requirements.roles.join(", ")}</p>
                    <p><strong>Features:</strong> {requirements.features.join(", ")}</p>
                </div>
            )}

            {/*mock ui*/}
            {requirements && (
                <div className="mock-ui">
                    <h2>{requirements.appName}</h2>

                    {/*roles tab navigation*/}
                    {requirements.roles && requirements.roles.length > 0 && (
                        <div className="role-tabs">
                            <h3>Select User Role:</h3>
                            <div className="tab-buttons">
                                {requirements.roles.map((role) => (
                                    <button
                                        key={role}
                                        className={`tab-button ${activeTab === role ? 'active' : ''}`}
                                        onClick={() => setActiveTab(role)}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/*role-specific content*/}
                    {activeTab && (
                        <div className="role-content">
                            <h3>{activeTab} Dashboard</h3>
                            
                            {/* Role-specific features */}
                            <div className="role-features">
                                <h4>Available Actions:</h4>
                                <div className="feature-list">
                                    {getRoleSpecificContent(activeTab).features.map((feature, index) => (
                                        <button key={index} className="feature-button">
                                            {feature}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/*entity forms for the selected role*/}
                            <div className="forms">
                                {Object.entries(getRoleSpecificContent(activeTab).entities).map(([entity, fields]) => (
                                    <div key={entity} className="form-card">
                                        <h4>Manage {entity}</h4>
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            {(fields || []).map((field, index) => (
                                                <div key={index} className="form-field">
                                                  <label>{field}</label>
                                                  <input placeholder={`Enter ${field}...`} />
                                                </div>
                                            ))}
                                            <button type="submit">Save {entity}</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default HomePage;