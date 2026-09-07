import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Cloud, Plus, Folder, FileText, Star, Trash2, Users, 
  Clock, Settings, LogOut, X, HardDrive, Share2, Copy, 
  LayoutGrid, List as ListIcon, Globe, Download, MoreVertical, RotateCcw, Sparkles, Image as ImageIcon, Search 
} from "lucide-react";

const translations = {
  English: {
    myDrive: "My Drive",
    sharedWithMe: "Shared with me",
    starred: "Starred",
    recent: "Recently",
    trashBin: "Trash Bin",
    uploadFile: "Upload File",
    newFolder: "New Folder",
    folders: "Folders",
    name: "Name",
    size: "Size",
    actions: "Actions",
    download: "Download",
    shareAndAccess: "Share & Access",
    copyLink: "Copy Link",
    star: "Add Star",
    unstar: "Unstar",
    delete: "Delete",
    restore: "Restore",
    deleteForever: "Delete Forever",
    moveToTrash: "Move to Trash",
    clearAllFiles: "Remove All Files & Folders",
    profileSettings: "Profile & App Settings",
    signOut: "Sign Out",
    languageSelection: "Language Selection",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    create: "Create",
    noFiles: "No files found in this view. Upload something to get started!",
    driveSpace: "Cloud Workspace",
    shareWithOthers: "Share with others",
    peopleWithAccess: "People with access",
    add: "Add",
    emailPlaceholder: "Add people or email (e.g., editor@gmail.com)",
    searchPlaceholder: "Search files, folders, and types..."
  },
  Hindi: {
    myDrive: "मेरी ड्राइव",
    sharedWithMe: "मेरे साथ साझा किया गया",
    starred: "starred फ़ाइलें",
    recent: "हाल ही की",
    trashBin: "ट्रैश बिन",
    uploadFile: "फ़ाइल अपलोड करें",
    newFolder: "नया फ़ोल्डर",
    folders: "फ़ोल्डर",
    name: "नाम",
    size: "आकार",
    actions: "कार्रवाई",
    download: "डाउनलोड",
    shareAndAccess: "साझा करें और एक्सेस करें",
    copyLink: "लिंक कॉपी करें",
    star: "स्टार जोड़ें",
    unstar: "स्टार हटाएं",
    delete: "हटाएं",
    restore: "पुनस्थापना",
    deleteForever: "स्थाई रूप से हटाएं",
    moveToTrash: "ट्रैश में ले जाएं",
    clearAllFiles: "सभी फ़ाइलें और फ़ोल्डर हटाएं",
    profileSettings: "प्रोफ़ाइल और ऐप सेटिंग्स",
    signOut: "साइन आउट",
    languageSelection: "भाषा चयन",
    saveChanges: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    create: "बनाएं",
    noFiles: "इस दृश्य में कोई फ़ाइल नहीं मिली। आरंभ करने के लिए कुछ अपलोड करें!",
    driveSpace: "क्लाउड वर्कस्पेस",
    shareWithOthers: "दूसरों के साथ साझा करें",
    peopleWithAccess: "एक्सेस वाले लोग",
    add: "जोड़ें",
    emailPlaceholder: "लोग या ईमेल जोड़ें",
    searchPlaceholder: "फ़ाइलें, फ़ोल्डर खोजें..."
  },
  Telugu: {
    myDrive: "నా డ్రైవ్",
    sharedWithMe: "నాతో భాగస్వామ్యం చేయబడింది",
    starred: "స్టార్ చేయబడినవి",
    recent: "ఇత్తీచినవి",
    trashBin: "ట్రాష్ బిన్",
    uploadFile: "ఫైల్ అప్‌లోడ్ చేయండి",
    newFolder: "కొత్త ఫోల్డర్",
    folders: "ఫోల్డర్‌లు",
    name: "పేరు",
    size: "పరిమాణం",
    actions: "చర్యలు",
    download: "డౌన్‌లోడ్",
    shareAndAccess: "షేర్ & యాక్సెస్",
    copyLink: "లింక్ కాపీ చేయండి",
    star: "స్టార్ జోడించు",
    unstar: "స్టార్ తీసివేయి",
    delete: "తొలగించు",
    restore: "పునరుద్ధరించు",
    deleteForever: "శాశ్వతంగా తొలగించు",
    moveToTrash: "ట్రాష్‌కి తరలించు",
    clearAllFiles: "అన్ని ఫైల్‌లు మరియు ఫోల్డర్‌లను తొలగించు",
    profileSettings: "ప్రొఫైల్ & యాప్ సెట్టింగ్‌లు",
    signOut: "సైన్ అవుట్",
    languageSelection: "భాష ఎంపిక",
    saveChanges: "మార్పులను సేవ్ చేయండి",
    cancel: "రద్దు చేయు",
    create: "సృష్టించు",
    noFiles: "ఫైల్‌లు కనుగొనబడలేదు. ప్రారంభించడానికి ఏదైనా అప్‌లోడ్ చేయండి!",
    driveSpace: "క్లౌడ్ వర్క్‌స్పేస్",
    shareWithOthers: "ఇతరులతో పంచుకోండి",
    peopleWithAccess: "యాక్సెస్ ఉన్న వ్యక్తులు",
    add: "జోడించు",
    emailPlaceholder: "ఇమెయిల్ జోడించండి",
    searchPlaceholder: "ఫైల్‌లు, ఫోల్డర్‌ల కోసం వెతకండి..."
  }
};

export default function App() {
  const [user, setUser] = useState(null); 
  const [authMode, setAuthMode] = useState("login"); 
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");

  const [activeTab, setActiveTab] = useState("drive"); 
  const [viewMode, setViewMode] = useState("list"); 
  const [language, setLanguage] = useState("English"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);

  const [shareModalFile, setShareModalFile] = useState(null);
  const [shareEmailInput, setShareEmailInput] = useState("");
  const [shareRole, setShareRole] = useState("Viewer");
  const [sharedEmailsList, setSharedEmailsList] = useState([]);

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const [statusMsg, setStatusMsg] = useState("");
  
  const fileInputRef = useRef(null);
  const API_URL = "http://localhost:5000/api";
  const BASE_URL = "http://localhost:5000";

  const t = (key) => translations[language]?.[key] || translations["English"][key] || key;

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchAllData = async () => {
    try {
      const [resFiles, resFolders] = await Promise.all([
        axios.get(`${API_URL}/files`).catch(() => null),
        axios.get(`${API_URL}/folders`).catch(() => null)
      ]);
      if (resFiles && Array.isArray(resFiles.data)) {
        setFiles(resFiles.data);
      }
      if (resFolders && Array.isArray(resFolders.data)) {
        setFolders(resFolders.data);
      }
    } catch (err) {
      console.log("Using local offline storage mode due to backend error.");
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !passInput) return;

    if (authMode === "signup") {
      localStorage.setItem(`custom_pass_${emailInput}`, passInput);
      localStorage.setItem(`custom_name_${emailInput}`, nameInput || emailInput.split("@")[0]);
      
      setAuthMode("login");
      setStatusMsg("Account created successfully! Please sign in.");
      setPassInput("");
      setTimeout(() => setStatusMsg(""), 4000);
    } else {
      const savedPass = localStorage.getItem(`custom_pass_${emailInput}`) || "admin";
      const savedName = localStorage.getItem(`custom_name_${emailInput}`) || emailInput.split("@")[0];

      if (passInput !== savedPass) {
        setStatusMsg("❌ Incorrect password! Access denied.");
        setTimeout(() => setStatusMsg(""), 4000);
        return;
      }

      setUser({ email: emailInput, name: savedName });
      setStatusMsg(`Welcome back, ${savedName}! Workspace loaded.`);
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setEmailInput("");
    setPassInput("");
    setNameInput("");
    setAuthMode("login");
    setFiles([]);
    setFolders([]);
    setShowProfileMenu(false);
  };

  const processUploadedFile = async (uploadedFile) => {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("owner_email", user?.email || "anonymous");

    try {
      setStatusMsg("Uploading file...");
      const res = await axios.post(`${API_URL}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data) {
        await fetchAllData();
      }
      setStatusMsg(`File "${uploadedFile.name}" uploaded successfully.`);
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (error) {
      const isImage = uploadedFile.type.startsWith("image/");
      const newLocalFile = {
        id: `file-${Date.now()}`,
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        url: URL.createObjectURL(uploadedFile),
        is_starred: false,
        is_trash: false,
        is_deleted: false,
        isImage: isImage
      };
      setFiles(prev => [newLocalFile, ...prev]);
      setStatusMsg(`File "${uploadedFile.name}" added successfully.`);
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files ? e.target.files[0] : null;
    await processUploadedFile(uploadedFile);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedFile = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    if (droppedFile) {
      await processUploadedFile(droppedFile);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName) return;
    try {
      await axios.post(`${API_URL}/folders`, { name: newFolderName, owner_email: user.email });
      await fetchAllData();
    } catch {
      const newFolderItem = { id: `f-${Date.now()}`, name: newFolderName, is_trash: false, is_deleted: false };
      setFolders(prev => [...prev, newFolderItem]);
    }
    setStatusMsg(`Folder "${newFolderName}" created.`);
    setNewFolderName("");
    setShowNewFolderModal(false);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleToggleStar = async (fileId, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/files/${fileId}/star`, { isStarred: !currentStatus });
      await fetchAllData();
    } catch {
      setFiles(files.map(f => ((f.id === fileId || f._id === fileId)) ? { ...f, is_starred: !currentStatus } : f));
    }
    setStatusMsg(!currentStatus ? "Added to starred." : "Removed star.");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  const handleMoveToTrash = async (fileId, status) => {
    try {
      await axios.patch(`${API_URL}/files/${fileId}/trash`, { isTrash: status });
      await fetchAllData();
    } catch {
      setFiles(files.map(f => ((f.id === fileId || f._id === fileId)) ? { ...f, is_trash: status, is_deleted: status } : f));
    }
    setStatusMsg(status ? "Moved item to trash." : "Restored item successfully.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handlePermanentDelete = async (fileId) => {
    if (!window.confirm("Permanently delete this file?")) return;
    try {
      await axios.delete(`${API_URL}/files/${fileId}`);
      await fetchAllData();
    } catch {
      setFiles(files.filter(f => f.id !== fileId && f._id !== fileId));
    }
    setStatusMsg("File permanently deleted.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleFolderMoveToTrash = async (folderId, status) => {
    try {
      await axios.patch(`${API_URL}/folders/${folderId}/trash`, { isTrash: status });
      await fetchAllData();
    } catch {
      setFolders(folders.map(f => ((f.id === folderId || f._id === folderId)) ? { ...f, is_trash: status, is_deleted: status } : f));
    }
    setStatusMsg(status ? "Folder moved to trash." : "Folder restored.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleFolderPermanentDelete = async (folderId) => {
    if (!window.confirm("Permanently delete this folder?")) return;
    try {
      await axios.delete(`${API_URL}/folders/${folderId}`);
      await fetchAllData();
    } catch {
      setFolders(folders.filter(f => f.id !== folderId && f._id !== folderId));
    }
    setStatusMsg("Folder permanently deleted.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleRemoveAllFilesAndFolders = async () => {
    if (!window.confirm("Are you sure you want to clear ALL files and folders?")) return;
    try {
      await Promise.all([
        ...files.map(f => axios.delete(`${API_URL}/files/${f.id || f._id}`).catch(() => null)),
        ...folders.map(fo => axios.delete(`${API_URL}/folders/${fo.id || fo._id}`).catch(() => null))
      ]);
    } catch (err) {
      // Safe fallback
    }
    setFiles([]);
    setFolders([]);
    setStatusMsg("All files and folders cleared successfully.");
    setShowSettingsModal(false);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const getFileDownloadUrl = (file) => {
    if (!file.url || file.url === "#") return "";
    if (file.url.startsWith("blob:") || file.url.startsWith("http")) return file.url;
    return `${BASE_URL}${file.url}`;
  };

  const handleDownloadFile = async (file, e) => {
    e.preventDefault();
    const url = getFileDownloadUrl(file);
    if (!url) return;

    try {
      setStatusMsg("Downloading file...");
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setStatusMsg("Download started successfully.");
      setTimeout(() => setStatusMsg(""), 2500);
    } catch (err) {
      window.open(url, "_blank");
      setStatusMsg("");
    }
  };

  const handleCopyLink = (file) => {
    const fullUrl = getFileDownloadUrl(file) || window.location.href;
    navigator.clipboard.writeText(fullUrl);
    setStatusMsg("Link copied to clipboard!");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleAddEmailAccess = () => {
    if (!shareEmailInput) return;
    if (!sharedEmailsList.includes(shareEmailInput)) {
      setSharedEmailsList([...sharedEmailsList, shareEmailInput]);
      setShareEmailInput("");
    }
  };

  const handleSaveShareSettings = async () => {
    if (!shareModalFile) return;
    const fileId = shareModalFile.id || shareModalFile._id;
    try {
      await axios.patch(`${API_URL}/files/${fileId}/share`, {
        shared: true,
        role: shareRole,
        shared_with: sharedEmailsList
      });
      await fetchAllData();
    } catch {
      setFiles(files.map(f => ((f.id === fileId || f._id === fileId)) ? { ...f, role: shareRole, shared: true, shared_with: sharedEmailsList } : f));
    }
    setStatusMsg("Access permissions updated.");
    setShareModalFile(null);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const getFilteredItems = () => {
    const isDeleted = (item) => item.is_trash || item.is_deleted;
    let baseFiles = files;
    let baseFolders = folders;

    if (activeTab === "starred") {
      baseFiles = files.filter(f => f.is_starred && !isDeleted(f));
      baseFolders = folders.filter(f => f.is_starred && !isDeleted(f));
    } else if (activeTab === "trash") {
      baseFiles = files.filter(f => isDeleted(f));
      baseFolders = folders.filter(f => isDeleted(f));
    } else if (activeTab === "shared") {
      baseFiles = files.filter(f => ((f.shared_with && f.shared_with.includes(user?.email)) || f.shared) && !isDeleted(f));
      baseFolders = [];
    } else if (activeTab === "recent") {
      baseFiles = files.filter(f => !isDeleted(f));
      baseFolders = folders.filter(f => !isDeleted(f));
    } else {
      baseFiles = files.filter(f => !isDeleted(f));
      baseFolders = folders.filter(f => !isDeleted(f));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      baseFiles = baseFiles.filter(f => f.name.toLowerCase().includes(q));
      baseFolders = baseFolders.filter(fo => fo.name.toLowerCase().includes(q));
    }

    return { files: baseFiles, folders: baseFolders };
  };

  const totalBytesUsed = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const maxStorageBytes = 15 * 1024 * 1024 * 1024;
  const storagePercentage = Math.min(100, (totalBytesUsed / maxStorageBytes) * 100).toFixed(1);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07070a] flex flex-col justify-center items-center p-4 text-white relative overflow-hidden font-sans">
        <div className="max-w-md w-full bg-[#111116]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-700 rounded-3xl text-white shadow-xl">
              <Cloud className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-black mb-2 text-center tracking-tight text-white">
            {authMode === "signup" ? "Create Cloud Account" : "Secure Cloud Login"}
          </h1>
          <p className="text-xs text-zinc-400 text-center mb-6">
            {authMode === "signup" ? "Set up your custom password to initialize your account." : "Enter your email and your custom password to sign in."}
          </p>

          {statusMsg && (
            <div className="mb-4 bg-violet-500/15 border border-violet-500/30 text-violet-200 px-4 py-3 rounded-2xl text-xs font-medium text-center">
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === "signup" && (
              <div>
                <label className="text-[11px] font-bold text-zinc-300 ml-1 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#18181f] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            )}
            <div>
              <label className="text-[11px] font-bold text-zinc-300 ml-1 mb-1.5 block">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#18181f] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-300 ml-1 mb-1.5 block">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full bg-[#18181f] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-violet-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold py-3.5 rounded-2xl transition shadow-lg cursor-pointer text-sm mt-2">
              {authMode === "signup" ? "Complete Registration" : "Sign In to Drive"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            {authMode === "signup" ? "Already have an account? " : "New to Cloud Drive? "}
            <button 
              onClick={() => { setAuthMode(authMode === "signup" ? "login" : "signup"); setStatusMsg(""); }} 
              className="text-violet-400 font-bold hover:underline cursor-pointer"
            >
              {authMode === "signup" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { files: displayedFiles, folders: displayedFolders } = getFilteredItems();

  return (
    <div 
      className="min-h-screen bg-[#07070a] text-zinc-100 flex font-sans relative selection:bg-violet-500 selection:text-white"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />

      {isDraggingOver && (
        <div className="absolute inset-0 bg-violet-600/20 backdrop-blur-md z-50 flex flex-col items-center justify-center border-4 border-dashed border-violet-500 rounded-3xl m-4 pointer-events-none">
          <div className="p-6 bg-violet-500 text-white rounded-full shadow-2xl mb-4 animate-bounce">
            <Cloud className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Drop your file here to upload instantly</h2>
        </div>
      )}

      <aside className="w-72 bg-[#101015]/90 backdrop-blur-2xl border-r border-white/10 p-5 flex flex-col justify-between hidden md:flex z-20 shadow-2xl">
        <div>
          <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="p-2.5 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl text-white shadow-lg">
              <Cloud className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">Cloud Drive</span>
          </div>

          <div className="space-y-2.5 mb-6">
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">{t("uploadFile")}</span>
            </button>
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="w-full flex items-center justify-center space-x-2 bg-[#18181f] hover:bg-[#20202a] border border-white/10 text-zinc-200 font-bold py-3.5 px-4 rounded-2xl transition cursor-pointer"
            >
              <Folder className="w-4 h-4 text-violet-400" />
              <span className="text-xs">{t("newFolder")}</span>
            </button>
          </div>
          
          <nav className="space-y-1.5">
            {[
              { id: "drive", label: t("myDrive"), icon: HardDrive },
              { id: "shared", label: t("sharedWithMe"), icon: Users },
              { id: "starred", label: t("starred"), icon: Star },
              { id: "recent", label: t("recent"), icon: Clock },
              { id: "trash", label: t("trashBin"), icon: Trash2 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === tab.id 
                      ? "bg-gradient-to-r from-violet-500/20 to-indigo-600/15 text-violet-300 border border-violet-500/30 shadow-inner" 
                      : "text-zinc-400 hover:bg-[#18181f] hover:text-zinc-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-violet-400" : "text-zinc-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-[#15151c] border border-white/10 rounded-2xl p-3.5">
            <div className="flex justify-between items-center text-[11px] mb-2 font-medium text-zinc-400">
              <span>Storage Used</span>
              <span className="text-violet-400 font-bold">{storagePercentage}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${storagePercentage}%` }}></div>
            </div>
            <p className="text-[10px] text-zinc-500">{(totalBytesUsed / (1024 * 1024)).toFixed(1)} MB of 15 GB</p>
          </div>

          <div className="relative border-t border-white/10 pt-4">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#18181f] transition cursor-pointer"
            >
              <div className="flex items-center space-x-3 truncate">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left truncate">
                  <p className="text-xs font-bold text-zinc-100 truncate">{user.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                </div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-20 left-0 w-full bg-[#14141a] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50">
                <button 
                  onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/5 rounded-xl transition cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-violet-400" />
                  <span>{t("profileSettings")}</span>
                </button>
                <div className="h-px bg-white/10 my-1"></div>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("signOut")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-visible pb-40 z-10">
        {statusMsg && (
          <div className="mb-6 bg-violet-500/15 border border-violet-500/30 text-violet-200 px-5 py-3.5 rounded-2xl text-xs font-semibold flex items-center space-x-3 shadow-lg">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black capitalize tracking-tight text-white flex items-center gap-2">
              {activeTab} <span className="text-xs font-normal px-3 py-1 bg-[#14141a] border border-white/10 rounded-full text-zinc-400">{t("driveSpace")}</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121217]/80 backdrop-blur border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition shadow-inner"
              />
            </div>

            <div className="bg-[#121217]/80 backdrop-blur border border-white/10 p-1.5 rounded-2xl flex items-center space-x-1 shrink-0">
              <button 
                onClick={() => setViewMode("list")} 
                className={`p-2 rounded-xl text-xs transition cursor-pointer ${viewMode === "list" ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md" : "text-zinc-500 hover:text-white"}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("grid")} 
                className={`p-2 rounded-xl text-xs transition cursor-pointer ${viewMode === "grid" ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md" : "text-zinc-500 hover:text-white"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {displayedFolders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">{t("folders")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedFolders.map((folder, index) => {
                const folderId = folder.id || folder._id;
                const menuKey = `folder-${folderId}`;
                return (
                  <div key={folderId || index} className="bg-[#121217]/70 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:bg-[#18181f] hover:border-violet-500/40 transition shadow-lg relative group z-10">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400">
                        <Folder className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-zinc-200 truncate">{folder.name}</span>
                    </div>

                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === menuKey ? null : menuKey); }}
                        className="p-1.5 text-zinc-500 hover:text-white rounded-lg transition cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === menuKey && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#14141a] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl py-2 z-[999] text-xs text-zinc-200">
                          {activeTab === "trash" ? (
                            <>
                              <button onClick={() => handleFolderMoveToTrash(folderId, false)} className="w-full text-left px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-violet-400 cursor-pointer">
                                <RotateCcw className="w-4 h-4" />
                                <span>{t("restore")}</span>
                              </button>
                              <button onClick={() => handleFolderPermanentDelete(folderId)} className="w-full text-left px-4 py-2.5 hover:bg-rose-500/10 flex items-center space-x-2.5 text-rose-400 cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                                <span>{t("deleteForever")}</span>
                              </button>
                            </>
                          ) : (
                            <button onClick={() => handleFolderMoveToTrash(folderId, true)} className="w-full text-left px-4 py-2.5 hover:bg-rose-500/10 flex items-center space-x-2.5 text-rose-400 cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                              <span>{t("delete")}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "list" ? (
          <div className="bg-[#121217]/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-visible shadow-2xl relative">
            <table className="w-full text-left border-collapse overflow-visible">
              <thead>
                <tr className="bg-white/[0.02] text-xs font-bold text-zinc-500 border-b border-white/10">
                  <th className="py-4 px-6">{t("name")}</th>
                  <th className="py-4 px-6">{t("size")}</th>
                  <th className="py-4 px-6 text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm overflow-visible">
                {displayedFiles.map((file, index) => {
                  const fileId = file.id || file._id;
                  const downloadUrl = getFileDownloadUrl(file);
                  const menuKey = `file-${fileId}`;

                  return (
                    <tr key={fileId || index} className="hover:bg-white/[0.03] transition group relative">
                      <td className="py-4 px-6 flex items-center space-x-3.5">
                        <div className="p-2.5 bg-violet-500/10 rounded-2xl text-violet-400 shrink-0">
                          {file.isImage && downloadUrl ? (
                            <img src={downloadUrl} alt="" className="w-4 h-4 object-cover rounded-md" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        {downloadUrl ? (
                          <a href={downloadUrl} onClick={(e) => handleDownloadFile(file, e)} className="font-semibold text-xs text-violet-300 hover:underline truncate max-w-xs cursor-pointer">
                            {file.name}
                          </a>
                        ) : (
                          <span className="font-semibold text-xs text-zinc-200 truncate max-w-xs">{file.name}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-zinc-500">
                        {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown'}
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            onClick={() => handleToggleStar(fileId, file.is_starred)} 
                            className={`p-2 rounded-xl transition cursor-pointer ${file.is_starred ? "text-amber-400" : "text-zinc-500 hover:text-white"}`}
                          >
                            <Star className="w-4 h-4" fill={file.is_starred ? "currentColor" : "none"} />
                          </button>

                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === menuKey ? null : menuKey); }}
                            className="p-2 text-zinc-500 hover:text-white rounded-xl transition cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {openMenuId === menuKey && (
                          <div className="absolute right-0 top-full mt-2 w-52 bg-[#14141a] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl py-2 z-[999] text-xs text-zinc-200 text-left">
                            {activeTab === "trash" ? (
                              <>
                                <button onClick={() => handleMoveToTrash(fileId, false)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-violet-400 cursor-pointer">
                                  <RotateCcw className="w-4 h-4" />
                                  <span>{t("restore")}</span>
                                </button>
                                <button onClick={() => handlePermanentDelete(fileId)} className="w-full px-4 py-2.5 hover:bg-rose-500/10 flex items-center space-x-2.5 text-rose-400 cursor-pointer">
                                  <Trash2 className="w-4 h-4" />
                                  <span>{t("deleteForever")}</span>
                                </button>
                              </>
                            ) : (
                              <>
                                {downloadUrl ? (
                                  <button onClick={(e) => handleDownloadFile(file, e)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-zinc-200 cursor-pointer text-left">
                                    <Download className="w-4 h-4 text-violet-400" />
                                    <span>{t("download")}</span>
                                  </button>
                                ) : null}
                                <button onClick={() => { setShareModalFile(file); setShareRole(file.role || "Viewer"); setSharedEmailsList(file.shared_with || []); }} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-zinc-200 cursor-pointer">
                                  <Share2 className="w-4 h-4 text-violet-400" />
                                  <span>{t("shareAndAccess")}</span>
                                </button>
                                <button onClick={() => handleCopyLink(file)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-zinc-200 cursor-pointer">
                                  <Copy className="w-4 h-4 text-zinc-400" />
                                  <span>{t("copyLink")}</span>
                                </button>
                                <button onClick={() => handleToggleStar(fileId, file.is_starred)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-zinc-200 cursor-pointer">
                                  <Star className="w-4 h-4 text-amber-400" />
                                  <span>{file.is_starred ? t("unstar") : t("star")}</span>
                                </button>
                                <div className="h-px bg-white/10 my-1"></div>
                                <button onClick={() => handleMoveToTrash(fileId, true)} className="w-full px-4 py-2.5 hover:bg-rose-500/10 flex items-center space-x-2.5 text-rose-400 cursor-pointer">
                                  <Trash2 className="w-4 h-4" />
                                  <span>{t("delete")}</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {displayedFiles.length === 0 && displayedFolders.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-full text-zinc-600">
                          <Cloud className="w-8 h-8" />
                        </div>
                        <p className="text-xs text-zinc-500 font-medium max-w-sm">{t("noFiles")}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-visible">
            {displayedFiles.map((file, index) => {
              const fileId = file.id || file._id;
              const downloadUrl = getFileDownloadUrl(file);
              const menuKey = `file-grid-${fileId}`;

              return (
                <div key={fileId || index} className="bg-[#121217]/70 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col justify-between hover:border-violet-500/40 transition shadow-xl relative group z-10">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      {file.isImage && downloadUrl ? (
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-md">
                          <img src={downloadUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="p-3 bg-violet-500/15 text-violet-400 rounded-2xl">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === menuKey ? null : menuKey); }}
                        className="p-1.5 text-zinc-500 hover:text-white rounded-xl transition cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === menuKey && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#14141a] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl py-2 z-[999] text-xs text-zinc-200 text-left">
                          {activeTab === "trash" ? (
                            <>
                              <button onClick={() => handleMoveToTrash(fileId, false)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-violet-400 cursor-pointer">
                                <RotateCcw className="w-4 h-4" />
                                <span>{t("restore")}</span>
                              </button>
                              <button onClick={() => handlePermanentDelete(fileId)} className="w-full px-4 py-2.5 hover:bg-rose-500/10 flex items-center space-x-2.5 text-rose-400 cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                                <span>{t("deleteForever")}</span>
                              </button>
                            </>
                          ) : (
                            <>
                              {downloadUrl && (
                                <button onClick={(e) => handleDownloadFile(file, e)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-zinc-200 cursor-pointer text-left">
                                  <Download className="w-4 h-4 text-violet-400" />
                                  <span>{t("download")}</span>
                                </button>
                              )}
                              <button onClick={() => { setShareModalFile(file); setShareRole(file.role || "Viewer"); setSharedEmailsList(file.shared_with || []); }} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-zinc-200 cursor-pointer">
                                <Share2 className="w-4 h-4 text-violet-400" />
                                <span>{t("shareAndAccess")}</span>
                              </button>
                              <button onClick={() => handleCopyLink(file)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-zinc-200 cursor-pointer">
                                <Copy className="w-4 h-4 text-zinc-400" />
                                <span>{t("copyLink")}</span>
                              </button>
                              <button onClick={() => handleToggleStar(fileId, file.is_starred)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center space-x-2.5 text-zinc-200 cursor-pointer">
                                <Star className="w-4 h-4 text-amber-400" />
                                <span>{file.is_starred ? t("unstar") : t("star")}</span>
                              </button>
                              <div className="h-px bg-white/10 my-1"></div>
                              <button onClick={() => handleMoveToTrash(fileId, true)} className="w-full px-4 py-2.5 hover:bg-rose-500/10 flex items-center space-x-2.5 text-rose-400 cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                                <span>{t("delete")}</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {downloadUrl ? (
                      <a href={downloadUrl} onClick={(e) => handleDownloadFile(file, e)} className="font-semibold text-xs text-violet-300 hover:underline truncate block cursor-pointer">
                        {file.name}
                      </a>
                    ) : (
                      <span className="font-semibold text-xs text-zinc-200 truncate block">{file.name}</span>
                    )}
                    <p className="text-[10px] text-zinc-500 mt-1">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {shareModalFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#14141a] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <button onClick={() => setShareModalFile(null)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold mb-1">{t("shareWithOthers")}</h2>
            <p className="text-xs text-zinc-500 mb-6 truncate">File: {shareModalFile.name}</p>
            
            <div className="space-y-4 text-sm">
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder={t("emailPlaceholder")} 
                  value={shareEmailInput} 
                  onChange={(e) => setShareEmailInput(e.target.value)}
                  className="w-full bg-[#18181f] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500" 
                />
                <select 
                  value={shareRole} 
                  onChange={(e) => setShareRole(e.target.value)}
                  className="bg-[#18181f] border border-white/10 rounded-2xl px-3 py-3 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Editor">Editor</option>
                </select>
                <button onClick={handleAddEmailAccess} className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90 px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer whitespace-nowrap shadow-md">{t("add")}</button>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 mb-2">{t("peopleWithAccess")}:</p>
                <div className="bg-[#18181f]/80 border border-white/10 rounded-2xl p-3.5 max-h-36 overflow-y-auto space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-zinc-200">
                    <span className="truncate">{user.email}</span>
                    <span className="text-violet-400 font-bold shrink-0">Owner</span>
                  </div>
                  {sharedEmailsList.map((emailItem, idx) => (
                    <div key={idx} className="flex justify-between items-center text-zinc-200">
                      <span className="truncate">{emailItem}</span>
                      <span className="text-violet-400 font-semibold shrink-0">{shareRole}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex space-x-3">
                <button onClick={() => setShareModalFile(null)} className="w-1/2 bg-[#18181f] hover:bg-[#20202a] font-bold py-3.5 rounded-2xl cursor-pointer text-xs text-zinc-300 border border-white/10">{t("cancel")}</button>
                <button onClick={handleSaveShareSettings} className="w-1/2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90 font-bold py-3.5 rounded-2xl cursor-pointer text-xs shadow-lg">{t("saveChanges")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#14141a] border border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-white">
            <button onClick={() => setShowNewFolderModal(false)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold mb-4">{t("newFolder")}</h2>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-[#18181f] border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
              />
              <button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90 font-bold py-3.5 rounded-2xl transition cursor-pointer text-sm shadow-lg">{t("create")}</button>
            </form>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#14141a] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <button onClick={() => setShowSettingsModal(false)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold mb-5">{t("profileSettings")}</h2>
            <div className="space-y-4 text-sm">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Display Name</label>
                <input type="text" value={user.name} disabled className="w-full bg-[#18181f] border border-white/10 rounded-2xl px-4 py-3 text-zinc-500 text-xs" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Email Address</label>
                <input type="text" value={user.email} disabled className="w-full bg-[#18181f] border border-white/10 rounded-2xl px-4 py-3 text-zinc-500 text-xs" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-violet-400" />
                  <span>{t("languageSelection")}</span>
                </label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#18181f] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-white/10">
                <button onClick={handleRemoveAllFilesAndFolders} className="w-full bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 font-bold py-3 rounded-2xl cursor-pointer text-xs transition mb-3">
                  {t("clearAllFiles")}
                </button>
                <button 
                  onClick={() => { 
                    setShowSettingsModal(false); 
                    setLanguage(language); 
                    setStatusMsg("Preferences saved successfully!"); 
                    setTimeout(() => setStatusMsg(""), 3000); 
                  }} 
                  className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90 font-bold py-3.5 rounded-2xl cursor-pointer text-xs transition shadow-lg"
                >
                  {t("saveChanges")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}