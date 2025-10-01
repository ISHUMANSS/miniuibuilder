import { useEffect, useState } from 'react';
import './homepage.css';
import SavedUIList from '../components/saveduilist';
import RequirementsViewer from '../components/requirementsviewer';
import GeneratedUI from '../components/generatedui';
import InputSection from '../components/InputSection';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savedUIs, setSavedUIs] = useState([]);
    const [saving, setSaving] = useState(false);

    //API calls
    const handleSubmit = async () => {
        if (!description.trim()) {
            toast.warning("Please enter an app description before submitting");
            return;
        }

        setLoading(true); 
        setRequirements(null);

        try {
            const res = await fetch("/api/requirements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });
            if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);

            const data = await res.json();
            setRequirements(data);

            if (data.roles && data.roles.length > 0) setActiveTab(data.roles[0]);

            toast.success("Requirements generated!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to get AI requirements");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRequirements = async () => {
        if (!requirements) {
            toast.info("Nothing to save generate requirements first");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/ui", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requirements),
            });
            if (!res.ok) throw new Error("Save failed");

            const data = await res.json();

            toast.success(`Saved! ID: ${data.id}`);

            await fetchSavedUIs();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save UI");
        } finally {
            setSaving(false);
        }
    };

    const fetchSavedUIs = async () => {
        try {
            const res = await fetch("/api/ui");
            if (!res.ok) throw new Error("Failed to fetch saved UIs");

            const list = await res.json();
            setSavedUIs(list);
        } catch (err) {
            console.error(err);
            toast.error("Could not fetch saved UIs");
        }
    };


    //do things with the ui
    const applySavedUI = (ui) => {
        if (!ui) return;

        setRequirements({
            appName: ui.appName || ui["App Name"] || "Unnamed App",
            roles: ui.roles || ui.Roles || [],
            features: ui.features || ui.Features || {}, 
            entities: ui.entities || ui.Entities || {},
        });
        const roles = ui.roles || ui.Roles || [];

        setActiveTab(roles.length > 0 ? roles[0] : null);

        toast.info("Loaded saved UI.");
    };

    /**
     * This sorts out what features belong to what role and makes it so they will be in that tab
     * @param {*} role 
     * @returns 
     */
    const getRoleSpecificContent = (role) => {
        if (!requirements || !role) {
            return { entities: {}, features: [] };
        }

        //get features specifically for the selected role
        const roleFeatures = requirements.features?.[role] || [];

        //get the entities that match the role
        const roleEntities = requirements.entities?.[role] || {};

        return { 
            entities: roleEntities, 
            features: roleFeatures 
        };
    };


    useEffect(() => { 
        fetchSavedUIs(); 
    }, []);

    return (
        <div className="app-container">
            

            <h1>AI UI Mockup Portal</h1>
            <InputSection
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                loading={loading}
            />

            

            <RequirementsViewer 
                requirements={requirements} 
                onSave={handleSaveRequirements} 
                saving={saving} 
            />  

            <GeneratedUI
                requirements={requirements}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                getRoleSpecificContent={getRoleSpecificContent}
            />

            <div className="saved-ui-container-container">
                <SavedUIList savedUIs={savedUIs} applySavedUI={applySavedUI} saving={saving} fetchSavedUIs={fetchSavedUIs} />
            </div>
        </div>
    );
};

export default HomePage;