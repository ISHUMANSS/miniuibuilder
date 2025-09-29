import React from 'react';

const GeneratedUI = ({ requirements, activeTab, setActiveTab, getRoleSpecificContent }) => {
    if (!requirements) return null;

    const roleContent = activeTab ? getRoleSpecificContent(activeTab) : { entities: {}, features: [] };

    return (
        <div className="mock-ui">
            <h2>{requirements.appName}</h2>

            {/* Roles Tab Navigation */}
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

            {/* Role-specific content */}
            {activeTab && (
                <div className="role-content">
                    <h3>{activeTab} Dashboard</h3>

                    {/* Role-specific features */}
                    <div className="role-features">
                        <h4>Available Actions:</h4>
                        <div className="feature-list">
                            {roleContent.features.map((feature, index) => (
                                <button key={index} className="feature-button">
                                    {feature}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Entity forms */}
                    <div className="forms">
                        {Object.entries(roleContent.entities).map(([entity, fields]) => (
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
    );
};

export default GeneratedUI;
