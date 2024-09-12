import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Pic1 from "../../assets/1.png";
import Pic2 from "../../assets/2.png";

function UpdateQuiz() {
  let data;
  const location = useLocation();
  const navigate = useNavigate();
  const token = location?.state?.token;
  const [quizId, setQuizId] = useState(location?.state?.quizId);
  const headers = { Authorization: `Bearer ${token}` };

  const [_id, setId] = useState();
  const [users, setUsers] = useState();
  const [color, setColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(["Testing"]);
  const [name, setName] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [answers, setAnswers] = useState({});
  const [passingPercentage, setPassingPercentage] = useState(0);
  const [isPublicQuiz, setIsPublicQuiz] = useState("Choose Option");
  const [allowedUser, setAllowedUser] = useState([""]);

  function handleQuizNameChange(evt) {
    setName(evt.target.value);
  }

  function handleQuestionChange(questionNumber, e) {
    setQuestionList((oldArray) => {
      return oldArray.map((list) => {
        if (list.questionNumber === questionNumber) {
          return {
            questionNumber: list.questionNumber,
            question: e.target.value,
            options: list.options,
          };
        } else {
          return list;
        }
      });
    });
  }

  function handleOptionsChange(questionNumber, key, e) {
    e.preventDefault();
    setQuestionList((oldArray) => {
      return oldArray.map((list) => {
        if (list.questionNumber === questionNumber) {
          let option = {};
          for (let i in list.options) {
            if (i == key) {
              option = { ...option, [i]: e.target.value };
            } else {
              option = { ...option, [i]: list.options[i] };
            }
          }
          return {
            questionNumber: list.questionNumber,
            question: list.question,
            options: option,
          };
        } else {
          return list;
        }
      });
    });
  }

  function handleAnswersChange(key, e) {
    e.preventDefault();
    setAnswers((oldObject) => {
      return { ...oldObject, [key]: e.target.value };
    });
  }

  function handlePassingPercentageChange(evt) {
    evt.preventDefault();
    setPassingPercentage(evt.target.value);
  }

  function handlePublicQuizChange(evt) {
    evt.preventDefault();
    setIsPublicQuiz(evt.target.value);
  }

  function handleAllowedUserChange(index, e) {
    setAllowedUser((oldArray) => {
      return oldArray.map((value, ind) => {
        if (index === ind) {
          return e.target.value;
        } else {
          return value;
        }
      });
    });
  }

  function handleQuizAppClick(evt) {
    evt.preventDefault();
    navigate("/auth/quiz", { state: { token } });
  }

  function handleAddOptionClick(questionNumber) {
    setQuestionList((oldArray) => {
      return oldArray.map((list) => {
        if (list.questionNumber === questionNumber) {
          let length = Object.keys(oldArray[questionNumber - 1].options).length;
          const optionsList = list.options;
          const option = { ...optionsList, [`${++length}`]: "" };
          return {
            questionNumber: list.questionNumber,
            question: list.question,
            options: option,
          };
        } else {
          return list;
        }
      });
    });
  }

  function handleRemoveOptionClick(questionNumber) {
    setQuestionList((oldArray) => {
      return oldArray.map((list) => {
        if (list.questionNumber === questionNumber) {
          let length = Object.keys(oldArray[questionNumber - 1].options).length;
          const optionsList = list.options;
          let option = {};
          for (let key in optionsList) {
            if (key != length) {
              option = { ...option, [key]: optionsList[key] };
            }
          }
          return {
            questionNumber: list.questionNumber,
            question: list.question,
            options: option,
          };
        } else {
          return list;
        }
      });
    });
  }

  function handleAddQuesClick(evt) {
    evt.preventDefault();
    setQuestionList((oldArray) => {
      const length = questionList.length;
      return [
        ...oldArray,
        { questionNumber: length + 1, question: "", options: { 1: "" } },
      ];
    });
  }

  function handleRemoveQuesClick(evt) {
    evt.preventDefault();
    setQuestionList((oldArray) => {
      const length = questionList.length;
      return oldArray.filter((list) => {
        if (list.questionNumber === length) {
          return false;
        }
        return true;
      });
    });
    setAnswers((oldObject) => {
      const length = questionList.length;
      const answersLength = Object.keys(answers).length;
      if (answersLength !== 0) {
        let object = {};
        for (let i in oldObject) {
          if (i == length) {
            object = { ...object };
          } else {
            object = { ...object, [i]: oldObject[i] };
          }
        }
        return object;
      } else {
        return {};
      }
    });
  }

  function handleAddUserClick(evt) {
    evt.preventDefault();
    setAllowedUser((oldArray) => {
      return [...oldArray, ""];
    });
  }

  function handleRemoveUserClick(evt) {
    evt.preventDefault();
    setAllowedUser((oldArray) => {
      let length = oldArray.length;
      return oldArray.filter((value, index) => {
        if (index === length - 1) {
          return false;
        }
        return true;
      });
    });
  }

  function handleUpdateQuizClick(evt) {
    let flag = false;
    evt.preventDefault();
    setErrors([]);
    setColor("");
    setIsLoading(true);
    if (name.length < 10) {
      setErrors((oldArray) => [
        ...oldArray,
        "Quiz name should be 10 charcters long",
      ]);
    }
    if (questionList.length === 0) {
      setErrors((oldArray) => [...oldArray, "Please enter atleast 1 question"]);
    } else {
      questionList.forEach((list) => {
        flag = true;
        if (!list.question) {
          flag = false;
        }
        Object.values(list.options).forEach((option) => {
          if (!option) {
            flag = false;
          }
        });
        if (!flag) {
          setErrors((oldArray) => [
            ...oldArray,
            "Please enter question with options",
          ]);
        }
      });
    }
    if (questionList.length !== Object.keys(answers).length) {
      setErrors((oldArray) => [...oldArray, "Please enter answers"]);
    } else {
      flag = true;
      questionList.forEach((list) => {
        let opt = Object.keys(list.options);
        if (
          opt.indexOf(
            `${
              Object.values(answers)[
                Object.keys(answers).indexOf(list.questionNumber.toString())
              ]
            }`
          ) === -1
        ) {
          flag = false;
        }
      });
      if (!flag) {
        setErrors((oldArray) => [
          ...oldArray,
          "Please enter correct option number in answers",
        ]);
      }
    }
    if (!passingPercentage) {
      setErrors((oldArray) => [...oldArray, "Please enter passing percentage"]);
    } else if (passingPercentage === "0") {
      setErrors((oldArray) => [
        ...oldArray,
        "Passing percentage can not be zero",
      ]);
    } else if (isNaN(passingPercentage)) {
      setErrors((oldArray) => [...oldArray, "Enter valid passing percentage"]);
    }
    if (isPublicQuiz === "Choose Option") {
      setErrors((oldArray) => [
        ...oldArray,
        "Please choose is this is a public quiz?",
      ]);
    }
    if (isPublicQuiz === "false" || isPublicQuiz === false) {
      flag = true;
      allowedUser.forEach((value) => {
        if (value === "") {
          flag = false;
        }
      });
      if (!flag) {
        setErrors((oldArray) => [...oldArray, "Please enter allowed users"]);
      }
    }
  }

  if (isPublicQuiz === "true") {
    data = {
      _id,
      name,
      questionList,
      answers,
      difficultyLevel: "easy",
      passingPercentage,
      isPublicQuiz,
      allowedUser: [],
    };
  } else {
    data = {
      _id,
      name,
      questionList,
      answers,
      difficultyLevel: "easy",
      passingPercentage,
      isPublicQuiz,
      allowedUser,
    };
  }

  useEffect(() => {
    if (errors.length === 0) {
      axios
        .put("https://quiz-backend-apjq.onrender.com/quiz", data, { headers })
        .then((response) => {
          setIsLoading(false);
          setErrors(["Quiz updated, redirecting..."]);
          setColor("black");
          setTimeout(() => {
            navigate("/publish-quiz", { state: { token } });
          }, 1000);
        })
        .catch((error) => {
          setIsLoading(false);
          const message = error?.response?.data?.message;
          if (error?.response?.status === 500) {
            setErrors(["Try again after some time"]);
          } else if (message.includes("Validation failed!")) {
            setErrors(["Quiz name must be unique"]);
          } else {
            navigate("/");
          }
        });
    } else if (errors.length > 0) {
      setIsLoading(false);
    }
    if (!!quizId) {
      axios
        .get(`https://quiz-backend-apjq.onrender.com/quiz/${quizId}`, {
          headers,
        })
        .then((response) => {
          setQuizId("");
          setIsLoading(false);
          const quiz = response?.data?.data;
          setId(quiz?._id);
          setName(quiz?.name);
          setQuestionList(quiz?.questionList);
          setAnswers(quiz?.answers);
          setPassingPercentage(quiz?.passingPercentage);
          setIsPublicQuiz(quiz?.isPublicQuiz);
          setAllowedUser(quiz?.allowedUser);
        })
        .catch(() => {
          setIsLoading(false);
          setQuizId("");
          navigate("/");
        });
    }

    if (isPublicQuiz === "false") {
      setAllowedUser([""]);
    }
  }, [errors, isPublicQuiz]);

  if (!token && !quizId) {
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
      <div>
        <img
          src={Pic1}
          alt="pic1"
          style={{ position: "absolute", top: 200, left: 30 }}
        />

        <img
          src={Pic2}
          alt="pic1"
          style={{ position: "absolute", top: 270, right: 30, width: "250px" }}
        />
      </div>

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
          width: "50%",
          height: "100%",
          backgroundColor: "#e0e1dd",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ color: "#333652", marginBottom: "50px" }}>
            Update Quiz
          </h1>
          <div>
            <div>
              <div>
                <h2>Quiz Name</h2>
                <input
                  type="text"
                  id="Name"
                  value={name}
                  placeholder="Name must be 10 characters long and unique"
                  onChange={handleQuizNameChange}
                  style={{
                    width: "300px",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                />
              </div>
            </div>
            {!!questionList &&
              questionList.length !== 0 &&
              questionList.map((list) => {
                return (
                  <div key={list.questionNumber}>
                    <div>
                      <h2>Question {list.questionNumber}:</h2>
                      <input
                        type="text"
                        placeholder="Enter question"
                        value={list.question}
                        onChange={(e) =>
                          handleQuestionChange(list.questionNumber, e)
                        }
                        style={{
                          width: "300px",
                          padding: "10px",
                          borderRadius: "5px",
                          marginBottom: "10px",
                        }}
                      />
                    </div>
                    <div>
                      <h4>Options</h4>
                      {!!list.options &&
                        Object.keys(list.options).map(function (key) {
                          const lastKey = Object.keys(list.options).length;
                          let lastKeyString;
                          if (lastKey !== 1) {
                            lastKeyString = lastKey.toString();
                          }
                          return (
                            <div key={key}>
                              {key === "1" && (
                                <button
                                  onClick={() =>
                                    handleAddOptionClick(list.questionNumber)
                                  }
                                  key="addOption"
                                  style={{
                                    marginBottom: "20px",
                                    borderRadius: "4px",
                                    backgroundColor: "#333652",
                                    color: "white",
                                    padding: "5px",
                                  }}
                                >
                                  Add Option
                                </button>
                              )}

                              <div>
                                <span key={key}>{key}: </span>
                                <input
                                  type="text"
                                  value={list.options[key]}
                                  placeholder="Enter option"
                                  id="options"
                                  onChange={(e) =>
                                    handleOptionsChange(
                                      list.questionNumber,
                                      key,
                                      e
                                    )
                                  }
                                  style={{
                                    width: "285px",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    marginBottom: "10px",
                                  }}
                                />
                              </div>

                              {key === lastKeyString && (
                                <button
                                  onClick={() =>
                                    handleRemoveOptionClick(list.questionNumber)
                                  }
                                  key="removeOption"
                                  style={{
                                    marginBottom: "20px",
                                    borderRadius: "4px",
                                    backgroundColor: "red",
                                    color: "white",
                                    padding: "5px",
                                    marginLeft: "220px",
                                  }}
                                >
                                  Remove Option
                                </button>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            <div>
              <button
                onClick={handleAddQuesClick}
                key="addQues"
                style={{
                  marginBottom: "20px",
                  borderRadius: "4px",
                  backgroundColor: "#333652",
                  color: "white",
                  padding: "5px",
                }}
              >
                Add Question
              </button>
              {questionList.length === 0 ? (
                <button
                  onClick={handleRemoveQuesClick}
                  key="removeQues"
                  disabled
                  style={{
                    marginBottom: "20px",
                    borderRadius: "4px",
                    backgroundColor: "gray",
                    color: "black",
                    padding: "5px",
                    marginLeft: "110px",
                  }}
                >
                  Remove Question
                </button>
              ) : (
                <button
                  onClick={handleRemoveQuesClick}
                  key="removeQues"
                  style={{
                    marginBottom: "20px",
                    borderRadius: "4px",
                    backgroundColor: "red",
                    color: "white",
                    padding: "5px",
                    marginLeft: "110px",
                  }}
                >
                  Remove Question
                </button>
              )}
            </div>
            {questionList.length !== 0 && questionList.length !== 0 && (
              <div>
                <div>
                  <h2>Answers</h2>
                  {!!questionList &&
                    questionList.map((list) => {
                      return (
                        <div key={list.questionNumber}>
                          <span>Ques {list.questionNumber}: </span>
                          <input
                            type="text"
                            maxLength={1}
                            value={answers[list.questionNumber]}
                            placeholder="Enter the correct option number"
                            onChange={(e) =>
                              handleAnswersChange(list.questionNumber, e)
                            }
                            id="Answers"
                            style={{
                              width: "245px",
                              padding: "10px",
                              borderRadius: "5px",
                              marginBottom: "10px",
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            <div>
              <div>
                <h2>Passing Percentage</h2>
                <input
                  type="text"
                  placeholder="Enter the number only"
                  value={passingPercentage}
                  id="passing"
                  onChange={handlePassingPercentageChange}
                  style={{
                    width: "300px",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                />
              </div>
            </div>
            <div>
              <div>
                <h2>Is this is a public quiz?</h2>
                <select
                  style={{
                    width: "150px",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                  value={isPublicQuiz}
                  onChange={handlePublicQuizChange}
                >
                  <option value="Choose Option">Choose Option</option>
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select>
              </div>
            </div>
            {(isPublicQuiz === "false" || isPublicQuiz === false) && (
              <div>
                <div>
                  <h2>Allowed Users</h2>
                  {!!allowedUser &&
                    allowedUser.map((value, index) => {
                      let lastKey = allowedUser.length;
                      if (lastKey === 1) {
                        lastKey = undefined;
                      }
                      return (
                        <div key={index}>
                          <div>
                            <span id={index}>{index + 1}: </span>
                            <select
                              value={value}
                              onChange={(e) =>
                                handleAllowedUserChange(index, e)
                              }
                            >
                              <option value="">Choose Option</option>
                              {users?.map((user) => {
                                if (allowedUser.includes(user?._id)) {
                                  return (
                                    <option
                                      value={user?._id}
                                      key={user?._id}
                                      disabled
                                    >
                                      {user?._id}: {user?.name}
                                    </option>
                                  );
                                } else {
                                  return (
                                    <option value={user?._id} key={user?._id}>
                                      {user?._id}: {user?.name}
                                    </option>
                                  );
                                }
                              })}
                            </select>
                          </div>
                          {index === 0 && (
                            <button onClick={handleAddUserClick} key={index}>
                              Add User
                            </button>
                          )}
                          {index === lastKey - 1 && (
                            <button onClick={handleRemoveUserClick} key={index}>
                              Remove User
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {!!errors && errors.length > 0 && !errors.includes("Testing") && (
              <div>
                <ul>
                  {errors.map((message) => {
                    return <li key={message}>{message}</li>;
                  })}
                </ul>
              </div>
            )}
            <div>
              <button
                onClick={handleUpdateQuizClick}
                style={{
                  borderRadius: "4px",
                  padding: "10px 30px",
                  backgroundColor: "#588157",
                  color: "white",
                  fontSize: "16px",
                  marginTop: "20px",
                  marginBottom: "50px",
                  marginLeft: "210px",
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateQuiz;
