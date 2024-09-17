import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "@mui/material";

import Pic1 from "../../assets/1.png";
import Pic2 from "../../assets/2.png";

function PublishQuiz() {
  const isMobile = useMediaQuery("(max-width:600px");

  const location = useLocation();
  const navigate = useNavigate();

  const token = location?.state?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const [flag, setFlag] = useState(true);
  const [publishFlag, setPublishFlag] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [quizId, setQuizId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [myQuizList, setMyQuizList] = useState([]);

  function handlePublishButtonClick(id, e) {
    e.preventDefault();
    setIsLoading(true);
    setQuizId(id);

    setPublishFlag(true);
  }

  function handleUpdateClick(id, e) {
    e.preventDefault();
    setQuizId(id);
    setFlag(!flag);

    setUpdateFlag(true);
  }

  function handleDeleteQuizClick(id, e) {
    e.preventDefault();
    setIsLoading(true);
    axios
      .delete(`https://quiz-backend-psi.vercel.app/quiz/${id}`, { headers })
      .then(() => {
        setFlag(!flag);
      })
      .catch(() => {
        setIsLoading(false);
        setFlag(!flag);
        navigate("/");
      });
  }

  useEffect(() => {
    if (!!quizId & publishFlag) {
      axios
        .patch(
          "https://quiz-backend-psi.vercel.app/quiz/publish",
          { quizId },
          { headers }
        )
        .then((response) => {
          setQuizId("");
          setFlag(!flag);
        })
        .catch((error) => {
          setQuizId("");
          setFlag(!flag);
          navigate("/");
        });
    }
    axios
      .get("https://quiz-backend-psi.vercel.app/quiz", { headers })
      .then((response) => {
        setIsLoading(false);
        setMyQuizList(response?.data?.data);
      })
      .catch((error) => {
        setIsLoading(false);
        const message = error?.response?.data?.message;
        if (message.includes("Quiz not found!")) {
          setMyQuizList(["No quiz found"]);
        }
      });
  }, [quizId, flag]);

  useEffect(() => {
    if (!!quizId & updateFlag) {
      axios
        .get(`https://quiz-backend-psi.vercel.app/quiz/${quizId}`, {
          headers,
        })
        .then((response) => {
          setIsLoading(false);
          navigate("/updatequiz", { state: { token, quizId } });
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("update error", error);
          navigate("/");
        });
    }

    axios
      .get("https://quiz-backend-psi.vercel.app/quiz", { headers })
      .then((response) => {
        setIsLoading(false);
        setMyQuizList(response?.data?.data);
      })
      .catch((error) => {
        setIsLoading(false);
        const message = error?.response?.data?.message;
        if (message.includes("Quiz not found!")) {
          setMyQuizList(["No quiz found"]);
        }
      });
  }, [quizId, flag]);

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
              top: 270,
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
          marginTop: isMobile ? "250px" : "150px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Publish Quiz</h2>

          <div style={{ marginTop: 15, marginBottom: 15 }}>
            {!!myQuizList &&
              myQuizList.length != 0 &&
              myQuizList.map((list) => {
                return (
                  <div key={list._id}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: isMobile ? "160px" : "250px" }}>
                        <h4 style={{ fontSize: isMobile ? "16px" : "18px" }}>
                          {list.name}
                        </h4>
                      </div>
                      {list?.isPublished ? (
                        <div>
                          <button
                            disabled
                            style={{
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: "gray",
                              color: "white",
                              padding: "5px",
                              width: isMobile ? "70px" : "75px",
                              height: "30px",
                            }}
                          >
                            Published
                          </button>

                          <button
                            disabled
                            style={{
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: "gray",
                              color: "white",
                              padding: "5px",
                              width: isMobile ? "55px" : "75px",
                              height: "30px",
                              marginLeft: isMobile ? "10px" : "20px",
                            }}
                          >
                            Update
                          </button>

                          <button
                            disabled
                            style={{
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: "gray",
                              color: "white",
                              padding: "5px",
                              marginLeft: isMobile ? "10px" : "20px",
                              width: isMobile ? "55px" : "75px",
                              height: "30px",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={(e) =>
                              handlePublishButtonClick(list._id, e)
                            }
                            style={{
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: "#333652",
                              color: "white",
                              padding: "5px",
                              cursor: "pointer",
                              width: isMobile ? "70px" : "75px",
                              height: "30px",
                            }}
                          >
                            Publish
                          </button>

                          <button
                            onClick={(e) => handleUpdateClick(list._id, e)}
                            style={{
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: "#333652",
                              color: "white",
                              padding: "5px",
                              cursor: "pointer",
                              marginLeft: isMobile ? "10px" : "20px",
                              width: isMobile ? "55px" : "75px",
                              height: "30px",
                            }}
                          >
                            Update
                          </button>

                          <button
                            onClick={(e) => handleDeleteQuizClick(list._id, e)}
                            style={{
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: "red",
                              color: "white",
                              padding: "5px",
                              cursor: "pointer",
                              marginLeft: isMobile ? "10px" : "20px",
                              width: isMobile ? "55px" : "75px",
                              height: "30px",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            {!!myQuizList && myQuizList.length === 0 && (
              <div>
                <div>
                  <div>
                    <h4 style={{ fontSize: "18px" }}>No quiz found!</h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublishQuiz;
