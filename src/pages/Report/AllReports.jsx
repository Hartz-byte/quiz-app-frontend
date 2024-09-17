import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "@mui/material";

import Pic1 from "../../assets/1.png";
import Pic2 from "../../assets/2.png";
import Pic3 from "../../assets/3.png";

function AllReports() {
  const isMobile = useMediaQuery("(max-width:600px");
  const location = useLocation();
  const navigate = useNavigate();

  const token = location?.state?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [flag, setFlag] = useState(0);
  const [tempReports, setTempReports] = useState();

  useEffect(() => {
    if (!tempReports) {
      axios
        .get(`https://quiz-backend-psi.vercel.app/report`, { headers })
        .then((response) => {
          setFlag(!flag);
          setTempReports(response?.data?.data);
        })
        .catch(() => {
          console.log("error: ", error);

          navigate("/");
        });
    } else if (!!tempReports) {
      console.log("Temp reports: ", tempReports);

      tempReports.map((report, index) => {
        axios
          .get("https://quiz-backend-psi.vercel.app/quiz/allpublishedquiz", {
            headers,
          })
          .then((response) => {
            // console.log(response?.data?.data[index].name);

            setTempReports((oldReports) =>
              oldReports.map((oldReport, i) => ({
                ...oldReport,
                quizName: response?.data?.data[i].name,
              }))
            );
          })
          .catch(() => {
            navigate("/");
          });
      });
    }
  }, [flag]);

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
              top: 300,
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
          width: isMobile ? "100%" : "50%",
          height: "100%",
          backgroundColor: "#e0e1dd",
          borderRadius: "15px",
          marginTop: isMobile ? "200px" : "",
        }}
      >
        <h1 style={{ textAlign: "center" }}>All Reports</h1>

        {!!tempReports &&
          tempReports.map((report, index) => {
            return (
              <div
                key={index}
                style={{ marginLeft: "20px", marginBottom: "100px" }}
              >
                <div>
                  <h1>Report {index + 1}</h1>
                  <h4>Quiz Name: {report?.quizName}</h4>
                  <h4>Result: {report.result}</h4>
                  <h4>Percentage: {report.percentage} %</h4>
                  <h4>
                    Score: {report.score} / {report.total}
                  </h4>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AllReports;
