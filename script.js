const STORAGE_KEY = "careertrack_applications_v1";
const $ = (id) => document.getElementById(id);
const modal = $("applicationModal");
let applications = loadApplications();
let toastTimer;

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function loadApplications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return JSON.parse(saved);
  } catch (error) {
    console.warn("Could not read saved applications.", error);
  }
  // Example entries make the dashboard useful on first launch.
  return [
    {id: crypto.randomUUID(), company:"NovaTech", role:"Junior Software Developer", date:dateOffset(-2), status:"Applied", followup:dateOffset(3), notes:"Applied through the company careers page."},
    {id: crypto.randomUUID(), company:"BrightWave Labs", role:"Frontend Developer Intern", date:dateOffset(-5), status:"Interview", followup:dateOffset(1), notes:"Prepare JavaScript and project discussion."},
    {id: crypto.randomUUID(), company:"CloudNest", role:"Graduate Engineer Trainee", date:dateOffset(-7), status:"Wishlist", followup:"", notes:"Check job requirements before applying."}
  ];
}
function saveApplications() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    showToast("Could not save data in this browser.");
  }
}
function prettyDate(value) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"});
}
function statusClass(status) {
  return `status-${status.toLowerCase()}`;
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function renderStats() {
  $("totalCount").textContent = applications.filter(a => a.status !== "Wishlist").length;
  $("interviewCount").textContent = applications.filter(a => a.status === "Interview").length;
  $("offerCount").textContent = applications.filter(a => a.status === "Offer").length;
  const today = dateOffset(0);
  $("followupCount").textContent = applications.filter(a => a.followup && a.followup <= today && !["Offer","Rejected"].includes(a.status)).length;
}
function renderApplications() {
  const query = $("searchInput").value.trim().toLowerCase();
  const filter = $("statusFilter").value;
  const list = applications.filter(a => {
    const matchesText = `${a.company} ${a.role} ${a.notes || ""}`.toLowerCase().includes(query);
    return matchesText && (filter === "All" || a.status === filter);
  }).sort((a,b) => (b.date || "").localeCompare(a.date || ""));
  $("applicationsBody").innerHTML = list.map(a => {
    const initials = a.company.trim().split(/\s+/).slice(0,2).map(w => w[0] || "").join("").toUpperCase();
    const due = a.followup && a.followup <= dateOffset(0) && !["Offer","Rejected"].includes(a.status);
    return `<tr>
      <td><div class="company-cell"><div class="company-logo">${escapeHTML(initials)}</div><div><strong>${escapeHTML(a.company)}</strong><small>${escapeHTML(a.role)}</small></div></div></td>
      <td>${prettyDate(a.date)}</td>
      <td><span class="status ${statusClass(a.status)}">${escapeHTML(a.status)}</span></td>
      <td class="${due ? "followup-due" : ""}">${prettyDate(a.followup)}</td>
      <td><div class="row-actions"><button class="icon-btn" data-action="edit" data-id="${escapeHTML(a.id)}" title="Edit application" aria-label="Edit ${escapeHTML(a.company)}">✎</button><button class="icon-btn" data-action="delete" data-id="${escapeHTML(a.id)}" title="Delete application" aria-label="Delete ${escapeHTML(a.company)}">×</button></div></td>
    </tr>`;
  }).join("");
  $("emptyState").classList.toggle("visible", list.length === 0);
  $("applicationsBody").style.display = list.length === 0 ? "none" : "table-row-group";
  renderStats();
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function openModal(application = null) {
  $("applicationForm").reset();
  $("formError").textContent = "";
  $("editId").value = application?.id || "";
  $("modalTitle").textContent = application ? "Edit application" : "Add application";
  $("companyInput").value = application?.company || "";
  $("roleInput").value = application?.role || "";
  $("dateInput").value = application?.date || dateOffset(0);
  $("statusInput").value = application?.status || "Applied";
  $("followupInput").value = application?.followup || "";
  $("notesInput").value = application?.notes || "";
  modal.showModal();
  $("companyInput").focus();
}
function closeModal() { modal.close(); }
function handleSubmit(event) {
  event.preventDefault();
  const company = $("companyInput").value.trim();
  const role = $("roleInput").value.trim();
  const date = $("dateInput").value;
  if (!company || !role || !date) {
    $("formError").textContent = "Please fill in company, role, and date applied.";
    return;
  }
  const id = $("editId").value;
  const entry = {
    id: id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    company, role, date, status: $("statusInput").value,
    followup: $("followupInput").value,
    notes: $("notesInput").value.trim()
  };
  if (id) {
    applications = applications.map(a => a.id === id ? entry : a);
    showToast("Application updated successfully.");
  } else {
    applications.unshift(entry);
    showToast("Application added successfully.");
  }
  saveApplications();
  renderApplications();
  closeModal();
}
function handleTableAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const app = applications.find(a => a.id === button.dataset.id);
  if (!app) return;
  if (button.dataset.action === "edit") openModal(app);
  if (button.dataset.action === "delete") {
    if (confirm(`Delete the application for ${app.company}? This cannot be undone.`)) {
      applications = applications.filter(a => a.id !== app.id);
      saveApplications();
      renderApplications();
      showToast("Application deleted.");
    }
  }
}
$("todayLabel").textContent = new Date().toLocaleDateString("en-IN", {weekday:"short", day:"numeric", month:"short"});
$("openAddModal").addEventListener("click", () => openModal());
$("emptyAddBtn").addEventListener("click", () => openModal());
$("closeModal").addEventListener("click", closeModal);
$("cancelModal").addEventListener("click", closeModal);
$("applicationForm").addEventListener("submit", handleSubmit);
$("applicationsBody").addEventListener("click", handleTableAction);
$("searchInput").addEventListener("input", renderApplications);
$("statusFilter").addEventListener("change", renderApplications);
$("viewAllBtn").addEventListener("click", () => {
  $("searchInput").value = "";
  $("statusFilter").value = "All";
  renderApplications();
  $("applicationsBody").scrollIntoView({behavior:"smooth", block:"nearest"});
});
$("applicationsNav").addEventListener("click", () => {
  $("searchInput").focus();
  $("applicationsNav").classList.add("active");
  $("dashboardNav").classList.remove("active");
});
$("dashboardNav").addEventListener("click", () => {
  $("dashboardNav").classList.add("active");
  $("applicationsNav").classList.remove("active");
  window.scrollTo({top:0,behavior:"smooth"});
});
renderApplications();
