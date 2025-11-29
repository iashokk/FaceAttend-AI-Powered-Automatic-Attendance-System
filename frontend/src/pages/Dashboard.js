import React from "react";

function Dashboard() {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Overview</div>
            <div className="card-subtitle">
              Quick stats for your attendance system.
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ fontSize: 14 }}>
                Classes
              </div>
              <div style={{ fontSize: 24, marginTop: 4 }}>–</div>
              <div className="card-subtitle">Total classes configured</div>
            </div>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ fontSize: 14 }}>
                Students
              </div>
              <div style={{ fontSize: 24, marginTop: 4 }}>–</div>
              <div className="card-subtitle">Total enrolled students</div>
            </div>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ fontSize: 14 }}>
                Sessions Today
              </div>
              <div style={{ fontSize: 24, marginTop: 4 }}>–</div>
              <div className="card-subtitle">Attendance sessions planned</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
