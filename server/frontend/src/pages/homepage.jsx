import { useEffect, useState } from 'react';
import './homepage.css';
import SavedUIList from '../components/saveduilist';
import RequirementsViewer from '../components/requirementsviewer';
import GeneratedUI from '../components/generatedui';
import InputSection from '../components/InputSection';
import NavBar from '../components/navbar';

const HomePage = () => {
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savedUIs, setSavedUIs] = useState([]);
    const [saving, setSaving] = useState(false);

    // API calls
    const handleSubmit = async () => {
        if (!description.trim()) return alert("Please enter an app description before submitting");
        setLoading(true); setRequirements(null);
        try {
            const res = await fetch("/api/ui", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });
            if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
            const data = await res.json();
            setRequirements(data);
            if (data.roles && data.roles.length > 0) setActiveTab(data.roles[0]);
        } catch (err) { console.error(err); alert("Failed to get AI requirements."); }
        finally { setLoading(false); }
    };

    const handleSaveRequirements = async () => {
        if (!requirements) return alert("Nothing to save generate requirements first");
        setSaving(true);
        try {
            const res = await fetch("/api/ui", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requirements),
            });
            if (!res.ok) throw new Error("Save failed");
            const data = await res.json();
            alert("Saved! id: " + data.id);
            await fetchSavedUIs();
        } catch (err) { console.error(err); alert("Failed to save UI"); }
        finally { setSaving(false); }
    };

    const fetchSavedUIs = async () => {
        try {
            const res = await fetch("/api/ui");
            if (!res.ok) throw new Error("Failed to fetch saved UIs");
            const list = await res.json();
            setSavedUIs(list);
        } catch (err) { console.error(err); }
    };

    const applySavedUI = (ui) => {
        if (!ui) return;
        setRequirements({
            appName: ui.appName || ui["App Name"] || "Unnamed App",
            roles: ui.roles || ui.Roles || [],
            features: ui.features || ui.Features || [],
            entities: ui.entities || ui.Entities || {},
        });
        const roles = ui.roles || ui.Roles || [];
        setActiveTab(roles.length > 0 ? roles[0] : null);
    };

    const getRoleSpecificContent = (role) => {
        if (!requirements) return { entities: {}, features: [] };
        return { entities: requirements.entities || {}, features: requirements.features || [] };
    };


    useEffect(() => { 
        fetchSavedUIs(); 
    }, []);

    return (
        <div className="app-container">
            <NavBar />

            <h1>AI App Builder Portal</h1>
            <InputSection
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                loading={loading}
            />

            <div className="saved-ui-container-container">
                <div>
                    <button onClick={handleSaveRequirements} disabled={saving || !requirements}>
                        {saving ? "Saving..." : "Save Requirements"}
                    </button>
                </div>
                <SavedUIList savedUIs={savedUIs} applySavedUI={applySavedUI} saving={saving} fetchSavedUIs={fetchSavedUIs} />
            </div>

            <RequirementsViewer requirements={requirements} />
            <GeneratedUI
                requirements={requirements}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                getRoleSpecificContent={getRoleSpecificContent}
            />
        </div>
    );
};

export default HomePage;