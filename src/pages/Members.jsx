
import {
  Users,
  ArrowLeft,
  UserPlus,
  Search,
  UserRound,
  X,
  Pencil,
  Trash2,
  Eye,
  Wallet,
  CreditCard,
  MapPin,
  CalendarDays,
  GraduationCap,
  BriefcaseBusiness,
  Package,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./Members.css";

const API_URL = "http://127.0.0.1:5000/api/members";

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    contact: "",
  });

  // FETCH MEMBERS FROM BACKEND
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch member records.");
      }

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error("Member data could not be loaded.");
      }

      const formattedMembers = data.members.map((item) => ({
        id: item.Member_ID,
        memberId: item.Member_ID,
        name: item.Name || "",
        age: item.Age,
        contact: String(item.Contact || ""),
        location: item.Location || "",
        shgName: item.SHG_Name || "",
        role: item.Role || "",
        savings: Number(item.Savings || 0),
        loans: Number(item.Loans || 0),
        joinDate: item.Join_Date || "",
        familyOccupation: item.Family_Occupation || "",
        craftSkill: item.Craft_Skill || "",
        education: item.Education || "",
        productIdMade: item.Product_ID_Made || "",
        isFromApi: true,
      }));

      setMembers(formattedMembers);
    } catch (err) {
      setError(
        "Could not connect to the backend. Please check whether Flask server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // SEARCH
  const filteredMembers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return members.filter((member) =>
      [
        member.memberId,
        member.name,
        member.contact,
        member.location,
        member.shgName,
        member.role,
        member.craftSkill,
      ].some((value) =>
        String(value || "").toLowerCase().includes(search)
      )
    );
  }, [members, searchTerm]);

  // STATISTICS
  const totalSavings = members.reduce(
    (total, member) => total + member.savings,
    0
  );

  const totalLoans = members.reduce(
    (total, member) => total + member.loans,
    0
  );

  // FORM INPUT
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ADD OR EDIT MEMBER
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.role.trim() ||
      !formData.contact.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (editingMemberId !== null) {
      setMembers((previous) =>
        previous.map((member) =>
          member.id === editingMemberId
            ? {
                ...member,
                name: formData.name.trim(),
                role: formData.role.trim(),
                contact: formData.contact.trim(),
              }
            : member
        )
      );
    } else {
      const newMember = {
        id: `TEMP-${Date.now()}`,
        memberId: "Temporary",
        name: formData.name.trim(),
        role: formData.role.trim(),
        contact: formData.contact.trim(),
        age: "-",
        location: "Not provided",
        shgName: "Not assigned",
        savings: 0,
        loans: 0,
        joinDate: "",
        familyOccupation: "",
        craftSkill: "",
        education: "",
        productIdMade: "",
        isFromApi: false,
      };

      setMembers((previous) => [...previous, newMember]);
    }

    closeForm();
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      contact: member.contact,
    });

    setEditingMemberId(member.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member from the current view?"
    );

    if (confirmed) {
      setMembers((previous) =>
        previous.filter((member) => member.id !== id)
      );
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMemberId(null);
    setError("");

    setFormData({
      name: "",
      role: "",
      contact: "",
    });
  };

  return (
    <div className="members-page">

      {/* HEADER */}
      <div className="members-header">
        <div>
          <span className="page-eyebrow">SHG CONNECT</span>
          <h1>SHG Members</h1>
          <p>
            Manage member profiles, group participation
            and financial information.
          </p>
        </div>

        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={17} />
          Dashboard
        </Link>
      </div>

      {/* STATISTICS */}
      <div className="member-stats">

        <div className="member-stat-card">
          <div className="member-stat-icon">
            <Users size={23} />
          </div>
          <div>
            <p>Total Members</p>
            <h2>{members.length}</h2>
          </div>
        </div>

        <div className="member-stat-card">
          <div className="member-stat-icon">
            <Wallet size={23} />
          </div>
          <div>
            <p>Total Savings</p>
            <h2>{formatCurrency(totalSavings)}</h2>
          </div>
        </div>

        <div className="member-stat-card">
          <div className="member-stat-icon">
            <CreditCard size={23} />
          </div>
          <div>
            <p>Total Loans</p>
            <h2>{formatCurrency(totalLoans)}</h2>
          </div>
        </div>

      </div>

      {/* MEMBER SECTION */}
      <section className="members-section">

        <div className="members-toolbar">
          <div>
            <span className="page-eyebrow">MEMBER DIRECTORY</span>
            <h2>Member Records</h2>
            <p className="members-count-text">
              {members.length} member records available
            </p>
          </div>

          <div className="members-toolbar-actions">
            <button
              className="member-refresh-button"
              type="button"
              onClick={fetchMembers}
              title="Refresh member data"
            >
              <RefreshCw size={17} />
            </button>

            <button
              className="add-member-button"
              type="button"
              onClick={() => setShowForm(true)}
            >
              <UserPlus size={17} />
              Add Member
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="members-search">
          <Search size={19} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, ID, location or SHG..."
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="members-message">
            Loading SHG member records...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="members-error">
            <p>{error}</p>
            <button type="button" onClick={fetchMembers}>
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredMembers.length === 0 && (
          <div className="members-empty">
            <div className="members-empty-icon">
              <Users size={40} />
            </div>
            <h3>
              {members.length === 0
                ? "No member records available"
                : "No matching members found"}
            </h3>
            <p>
              Try another name, member ID, location or SHG group.
            </p>
          </div>
        )}

        {/* MEMBER CARDS */}
        {!loading && !error && filteredMembers.length > 0 && (
          <div className="members-list">

            {filteredMembers.map((member) => (
              <div className="member-card" key={member.id}>

                <div className="member-avatar">
                  <UserRound size={24} />
                </div>

                <div className="member-info">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>

                  <small>
                    {member.memberId} | Age: {member.age ?? "N/A"}
                  </small>

                  <small className="member-shg-name">
                    {member.shgName}
                  </small>

                  <small className="member-location">
                    <MapPin size={13} />
                    {member.location}
                  </small>
                </div>

                <div className="member-card-finance">
                  <span>Savings</span>
                  <strong>{formatCurrency(member.savings)}</strong>
                  <span>Loans</span>
                  <strong>{formatCurrency(member.loans)}</strong>
                </div>

                <div className="member-actions">

                  <button
                    type="button"
                    className="member-view-btn"
                    onClick={() => setSelectedMember(member)}
                    title="View Details"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    type="button"
                    className="member-edit-btn"
                    onClick={() => handleEdit(member)}
                    title="Edit Member"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    className="member-delete-btn"
                    onClick={() => handleDelete(member.id)}
                    title="Delete Member"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </section>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="member-form-overlay">
          <div className="member-form-card">

            <div className="member-form-heading">
              <div>
                <span className="page-eyebrow">
                  {editingMemberId !== null ? "UPDATE RECORD" : "NEW RECORD"}
                </span>
                <h2>
                  {editingMemberId !== null
                    ? "Edit SHG Member"
                    : "Add SHG Member"}
                </h2>
              </div>

              <button
                type="button"
                className="member-form-close"
                onClick={closeForm}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="member-name">Member Name</label>
              <input
                id="member-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter member name"
                required
              />

              <label htmlFor="member-role">Role</label>
              <select
                id="member-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select role</option>
                <option value="SHG Member">SHG Member</option>
                <option value="Group Leader">Group Leader</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Secretary">Secretary</option>
                <option value="Member">Member</option>
              </select>

              <label htmlFor="member-contact">Contact Number</label>
              <input
                id="member-contact"
                name="contact"
                type="tel"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
              />

              {error && (
                <p className="member-form-error">{error}</p>
              )}

              <div className="member-form-actions">
                <button
                  type="button"
                  className="member-cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="add-member-button">
                  {editingMemberId !== null ? "Update Member" : "Save Member"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MEMBER DETAILS MODAL */}
      {selectedMember && (
        <div
          className="member-details-overlay"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="member-details-card"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="member-details-heading">
              <div>
                <span className="page-eyebrow">MEMBER PROFILE</span>
                <h2>{selectedMember.name}</h2>
                <p>{selectedMember.memberId}</p>
              </div>

              <button
                type="button"
                className="member-form-close"
                onClick={() => setSelectedMember(null)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="member-details-grid">

              <div className="member-detail-item">
                <span>Age</span>
                <strong>{selectedMember.age ?? "N/A"}</strong>
              </div>

              <div className="member-detail-item">
                <span>Contact</span>
                <strong>{selectedMember.contact || "N/A"}</strong>
              </div>

              <div className="member-detail-item">
                <span>SHG Group</span>
                <strong>{selectedMember.shgName || "N/A"}</strong>
              </div>

              <div className="member-detail-item">
                <span>Role</span>
                <strong>{selectedMember.role || "N/A"}</strong>
              </div>

              <div className="member-detail-item full-width">
                <span><MapPin size={14} /> Location</span>
                <strong>{selectedMember.location || "N/A"}</strong>
              </div>

              <div className="member-detail-item">
                <span><Wallet size={14} /> Savings</span>
                <strong>{formatCurrency(selectedMember.savings)}</strong>
              </div>

              <div className="member-detail-item">
                <span><CreditCard size={14} /> Loans</span>
                <strong>{formatCurrency(selectedMember.loans)}</strong>
              </div>

              <div className="member-detail-item">
                <span><CalendarDays size={14} /> Joined On</span>
                <strong>{selectedMember.joinDate || "N/A"}</strong>
              </div>

              <div className="member-detail-item">
                <span><GraduationCap size={14} /> Education</span>
                <strong>{selectedMember.education || "Not provided"}</strong>
              </div>

              <div className="member-detail-item">
                <span><BriefcaseBusiness size={14} /> Family Occupation</span>
                <strong>{selectedMember.familyOccupation || "Not provided"}</strong>
              </div>

              <div className="member-detail-item">
                <span>Craft / Skill</span>
                <strong>{selectedMember.craftSkill || "N/A"}</strong>
              </div>

              <div className="member-detail-item">
                <span><Package size={14} /> Product ID Made</span>
                <strong>{selectedMember.productIdMade || "N/A"}</strong>
              </div>

            </div>

            <button
              type="button"
              className="member-details-close-btn"
              onClick={() => setSelectedMember(null)}
            >
              Close Details
            </button>

          </div>
        </div>
      )}

      {/* DATA NOTE */}
      <section className="members-data-status">
        <Users size={25} />
        <div>
          <h3>SHG Member Database Connected</h3>
          <p>
            Member profiles are loaded from the SHG Connect backend API.
            Add, edit and delete actions are currently frontend-only;
            permanent database updates will be connected separately.
          </p>
        </div>
      </section>

    </div>
  );
}

export default Members;
