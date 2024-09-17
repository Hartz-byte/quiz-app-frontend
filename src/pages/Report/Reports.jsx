import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "@mui/material";

import Pic1 from "../../assets/1.png";
import Pic2 from "../../assets/2.png";

function Reports() {
  const isMobile = useMediaQuery("(max-width:600px");

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const reportId = params?.reportId;
  const token = location?.state?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [report, setReport] = useState();
  const [quizId, setQuizId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function handleAllReportsClick(evt) {
    evt.preventDefault();
    navigate("/all-reports", { state: { token } });
  }

  useEffect(() => {
    axios
      .get(`https://quiz-backend-psi.vercel.app/report/${reportId}`, {
        headers,
      })
      .then((response) => {
        setIsLoading(false);
        setReport(response?.data?.data);
        setQuizId(response?.data?.data?.quizId);
      })
      .catch((error) => {
        setIsLoading(false);
        navigate("/auth/login");
      });
  }, [quizId]);

  if (!token) {
    navigate("/");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* images */}
      {!isMobile && (
        <div>
          <img
            src={Pic1}
            alt="pic1"
            style={{ position: "absolute", top: 200, left: 30 }}
          />

          <img
            src={Pic2}
            alt="pic1"
            style={{
              position: "absolute",
              top: 260,
              right: 30,
              width: "250px",
            }}
          />
        </div>
      )}

      {/* side btns */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          position: "absolute",
          top: "5%",
          right: "5%",
        }}
      >
        <button
          onClick={() => {
            navigate("/home", { state: { token } });
          }}
          style={{
            width: "100px",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "7px",
          }}
        >
          Home
        </button>

        <button
          onClick={() => {
            navigate("/quizlist", { state: { token } });
          }}
          style={{
            width: "100px",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "7px",
          }}
        >
          Quizzes
        </button>

        <button
          onClick={() => {
            navigate("/favorite", { state: { token } });
          }}
          style={{
            width: "100px",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "7px",
          }}
        >
          Favorites
        </button>

        <button
          onClick={() => {
            navigate("/profile", { state: { token } });
          }}
          style={{
            width: "100px",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "7px",
          }}
        >
          Profile
        </button>

        <button
          onClick={() => {
            navigate("/");
          }}
          style={{
            width: "100px",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "7px",
          }}
        >
          Logout
        </button>
      </div>

      {/* main container */}
      <div
        style={{
          width: isMobile ? "100%" : "30%",
          height: "100%",
          backgroundColor: "#e0e1dd",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: isMobile ? "200px" : "140px",
        }}
      >
        <div>
          <h1 style={{ color: "#333652", marginLeft: "20px" }}>Quiz App</h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ color: "red" }}>Report</h2>
            {!!report && (
              <div style={{ marginBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex" }}>
                    <h3 style={{ width: "110px" }}>Status: </h3>
                    <h3 style={{ fontWeight: "bold" }}>{report.result}</h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    <h3 style={{ width: "110px" }}>Marks: </h3>
                    <h3>
                      {report.score}/{report.total}
                    </h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    <h3 style={{ width: "110px" }}>Percentage: </h3>
                    <h3>{report.percentage}%</h3>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleAllReportsClick}
              style={{
                marginBottom: "10px",
                borderRadius: "4px",
                backgroundColor: "#333652",
                color: "white",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              All Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
