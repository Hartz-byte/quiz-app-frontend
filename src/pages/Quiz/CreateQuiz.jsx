import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import Pic1 from "../../assets/1.png";
import Pic2 from "../../assets/2.png";
import Pic3 from "../../assets/3.png";

function CreateQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(["Testing"]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Choose Option");
  const [difficultyLevel, setDifficultyLevel] = useState("Choose Option");
  let [questionNo, setQuestionNo] = useState(1);
  const [questionList, setQuestionList] = useState([
    { questionNumber: 1, question: "", options: { 1: "" } },
  ]);
  const [answers, setAnswers] = useState({});
  const [passingPercentage, setPassingPercentage] = useState(0);
  const [attemptsAllowedPerUser, setAttemptsAllowed] = useState(0);
  const [isPublicQuiz, setIsPublicQuiz] = useState("Choose Option");
  const [allowedUser, setAllowedUser] = useState([""]);
  const [userNames, setUserNames] = useState([]);
  const [userData, setUserData] = useState([]);

  const token = location?.state?.token;
  const headers = { Authorization: `Bearer ${token}` };

  function handleQuizNameChange(evt) {
    setName(evt.target.value);
  }

  function handleCategoryChange(evt) {
    setCategory(evt.target.value);
  }

  function handleDifficultyLevelChange(evt) {
    setDifficultyLevel(evt.target.value);
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

  function handleAnswersChange(questionNumber, e) {
    setAnswers((oldObject) => {
      return { ...oldObject, [questionNumber]: e.target.value };
    });
  }

  function handlePassingPercentageChange(evt) {
    evt.preventDefault();
    setPassingPercentage(evt.target.value);
  }

  function handleAttemptsAllowedChange(evt) {
    evt.preventDefault();
    setAttemptsAllowed(evt.target.value);
  }

  function handlePublicQuizChange(evt) {
    evt.preventDefault();
    setIsPublicQuiz(evt.target.value);

    console.log(evt.target.value);
  }

  // function handleAllowedUserChange(index, e) {
  //   setAllowedUser((oldArray) => {
  //     let allowedUserList = [];
  //     return oldArray.map((value, ind) => {
  //       if (index === ind) {
  //         return e.target.value;
  //       } else {
  //         return value;
  //       }
  //     });
  //   });
  // }

  function handleAllowedUserChange(index, selectedOption) {
    setAllowedUser((oldArray) => {
      const newArray = [...oldArray];
      newArray[index] = selectedOption.value;
      return newArray;
    });
  }

  function handleLogoutClick(evt) {
    navigate("/");
  }

  function handleMyAccountClick(evt) {
    navigate("/profile", { state: { token } });
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

  function handleRemoveOptionClick(questionNumber, optionKey) {
    setQuestionList((oldArray) => {
      return oldArray.map((list) => {
        if (list.questionNumber === questionNumber) {
          const newOptions = { ...list.options };
          delete newOptions[optionKey];
          return {
            questionNumber: list.questionNumber,
            question: list.question,
            options: newOptions,
          };
        } else {
          return list;
        }
      });
    });
  }

  function handleAddQuesClick(evt) {
    evt.preventDefault();
    setQuestionNo(++questionNo);
    setQuestionList((oldArray) => {
      return [
        ...oldArray,
        { questionNumber: questionNo, question: "", options: { 1: "" } },
      ];
    });
  }

  function handleRemoveQuesClick(questionNumber) {
    setQuestionList((oldArray) => {
      // const questionNumber = questionNo + 1;
      return oldArray.filter((list) => {
        if (list.questionNumber === questionNumber) {
          return false;
        }
        return true;
      });
    });
    setQuestionNo(--questionNo);
  }

  function handleAddUserClick(evt) {
    evt.preventDefault();
    setAllowedUser((oldArray) => {
      let length = oldArray.length;
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

  function handleCreateQuizClick(evt) {
    let flag = false;
    evt.preventDefault();
    setErrors([]);
    setIsLoading(true);
    if (name.length < 10) {
      setErrors((oldArray) => [
        ...oldArray,
        "Quiz name should be 10 charcters long",
      ]);
    }
    if (category === "Choose Option") {
      setErrors((oldArray) => [...oldArray, "Choose category"]);
    } else if (category === "Exam") {
      setCategory("exam");
    } else if (category === "Test") {
      setCategory("test");
    }
    if (difficultyLevel === "Choose Option") {
      setErrors((oldArray) => [...oldArray, "Choose difficulty level"]);
    } else if (difficultyLevel === "Easy") {
      setDifficultyLevel("easy");
    } else if (difficultyLevel === "Medium") {
      setDifficultyLevel("medium");
    } else if (difficultyLevel === "Hard") {
      setDifficultyLevel("hard");
    }
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
    if (!!attemptsAllowedPerUser && isNaN(attemptsAllowedPerUser)) {
      setErrors((oldArray) => [...oldArray, "Enter valid attempts per user"]);
    }
    if (isPublicQuiz === "Choose Option") {
      setErrors((oldArray) => [
        ...oldArray,
        "Please choose is this is a public quiz?",
      ]);
    } else if (isPublicQuiz === "True") {
      setIsPublicQuiz(true);
    } else if (isPublicQuiz === "False") {
      setIsPublicQuiz(false);
    }
  }

  const data = {
    name,
    category,
    difficultyLevel,
    questionList,
    answers,
    passingPercentage,
    attemptsAllowedPerUser,
    isPublicQuiz,
    allowedUser,
  };

  useEffect(() => {
    if (errors.length === 0) {
      axios
        .post("http://localhost:3002/quiz", data, { headers })
        .then((response) => {
          setIsLoading(false);
          setErrors(["Quiz created, redirecting..."]);
          setTimeout(() => {
            navigate("/home", { state: { token } });
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
            navigate("/auth/login");
          }
        });
    } else {
      setIsLoading(false);
    }
  }, [errors]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/user/allusers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data.data.map((user) => ({
          // userId: user.id,
          // name: user.name || "",
          value: user.id,
          label: user.name,
        }));

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

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
      <div>
        <img
          src={Pic1}
          alt="pic1"
          style={{ position: "absolute", top: 200, left: 30 }}
        />

        <img
          src={Pic2}
          alt="pic1"
          style={{ position: "absolute", top: 650, right: 30, width: "250px" }}
        />

        <img
          src={Pic3}
          alt="pic1"
          style={{ position: "absolute", top: 1100, left: 30, width: "250px" }}
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
          onClick={handleMyAccountClick}
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
          onClick={handleLogoutClick}
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
        }}
      >
        <div style={{ margin: "50px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div
              style={{
                width: "25px",
                height: "25px",
                backgroundColor: "#333652",
                borderRadius: "50%",
              }}
            />

            <h1 style={{ color: "#333652" }}>Create Quiz</h1>
          </div>

          <div>
            <div>
              <h2 style={{ color: "#333652" }}>Quiz Name *</h2>
              <input
                type="text"
                id="Name"
                placeholder="Name of 10 characters long"
                onChange={handleQuizNameChange}
                style={{
                  width: "300px",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              />

              {/* border */}
              <div
                style={{
                  width: "671px",
                  height: "1px",
                  backgroundColor: "white",
                  position: "absolute",
                  left: "27.9%",
                  marginTop: "10px",
                }}
              />

              <h2 style={{ color: "#333652" }}>Details *</h2>
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div>
                  <h4 style={{ fontSize: "18px" }}>Category</h4>
                  <select
                    id="Category"
                    onChange={handleCategoryChange}
                    style={{
                      width: "250px",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "6px",
                    }}
                  >
                    <option value="Choose Option">Choose Option</option>
                    <option value="exam">Exam</option>
                    <option value="test">Test</option>
                  </select>
                </div>

                <div>
                  <h4>Difficulty Level </h4>
                  <select
                    id="DifficultyLevel"
                    onChange={handleDifficultyLevelChange}
                    style={{
                      width: "250px",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <option value="Choose Option">Choose Option</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div>
                  <div>
                    <h4 style={{ marginTop: "30px" }}>Passing Percentage</h4>
                    <input
                      type="text"
                      placeholder="Enter the number only"
                      id="passing"
                      onChange={handlePassingPercentageChange}
                      style={{
                        width: "225px",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <h4 style={{ marginTop: "30px" }}>
                      Attempts allowed per user
                    </h4>
                    <input
                      type="text"
                      placeholder="Total attempts allowed"
                      onChange={handleAttemptsAllowedChange}
                      id="attempts"
                      style={{
                        width: "225px",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <h4 style={{ marginTop: "30px" }}>
                    Is this is a public quiz?
                  </h4>
                  <select
                    onChange={handlePublicQuizChange}
                    style={{
                      width: "222px",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    <option value="Choose Option">Choose Option</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                </div>
              </div>

              {/* Allowed User */}
              {isPublicQuiz === "False" && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ marginTop: "30px" }}>Allowed User</h4>

                    {!!allowedUser &&
                      allowedUser.map((value, index) => {
                        const lastKey = allowedUser.length;
                        return (
                          <div key={index}>
                            {index === 0 && (
                              <button
                                style={{
                                  marginBottom: "20px",
                                  borderRadius: "4px",
                                  backgroundColor: "#333652",
                                  color: "white",
                                  padding: "5px",
                                }}
                                onClick={handleAddUserClick}
                                key={index}
                              >
                                Add User
                              </button>
                            )}

                            <Select
                              value={userData.find(
                                (option) => option.value === value
                              )}
                              onChange={(selectedOption) =>
                                handleAllowedUserChange(index, selectedOption)
                              }
                              options={userData}
                              placeholder="Select User"
                            />

                            {index === lastKey - 1 && (
                              <button
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "4px",
                                  backgroundColor: "red",
                                  color: "white",
                                  padding: "5px",
                                  marginLeft: "500px",
                                }}
                                onClick={handleRemoveUserClick}
                                key={index}
                              >
                                Remove User
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* border */}
              <div
                style={{
                  width: "671px",
                  height: "1px",
                  backgroundColor: "white",
                  position: "absolute",
                  left: "27.9%",
                  marginTop: "20px",
                }}
              />

              <div
                style={{
                  height: "100%",
                  backgroundColor: "#2a9d8f",
                  marginTop: "50px",
                  marginBottom: "10px",
                  paddingLeft: "50px",
                  paddingBottom: "15px",
                  borderRadius: "15px",
                }}
              >
                <h1
                  style={{
                    paddingTop: "20px",
                    marginLeft: "210px",
                    color: "white",
                    textDecoration: "underline",
                  }}
                >
                  Questions
                </h1>
                {questionList &&
                  questionList.map((list, index) => {
                    // let length = questionList.length;
                    // if (length === 1) {
                    //   length = undefined;
                    // }
                    return (
                      <div key={list.questionNumber}>
                        {list.questionNumber === 1 && (
                          <button
                            style={{
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: "#333652",
                              color: "white",
                              padding: "5px",
                            }}
                            onClick={handleAddQuesClick}
                            key="addQues"
                          >
                            Add Question
                          </button>
                        )}

                        <div>
                          <h2 style={{ color: "#fca311", marginLeft: "220px" }}>
                            Question {index + 1}:
                          </h2>
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
                          <p>Options</p>

                          <button
                            onClick={() =>
                              handleAddOptionClick(list.questionNumber)
                            }
                            key="addOption"
                            style={{
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: "#333652",
                              color: "white",
                              padding: "5px",
                            }}
                          >
                            Add Option
                          </button>

                          {!!list.options &&
                            Object.keys(list.options).map(function (key) {
                              const lastKey = Object.keys(list.options).length;
                              let lastKeyString;
                              if (lastKey !== 1) {
                                lastKeyString = lastKey.toString();
                              }
                              return (
                                <div key={key}>
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    <p>{key}</p>

                                    <input
                                      type="text"
                                      value={list.options[key]}
                                      placeholder={`Enter option ${key}`}
                                      id="options"
                                      onChange={(e) =>
                                        handleOptionsChange(
                                          list.questionNumber,
                                          key,
                                          e
                                        )
                                      }
                                      style={{
                                        width: "300px",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        marginBottom: "10px",
                                      }}
                                    />

                                    <button
                                      onClick={() =>
                                        handleRemoveOptionClick(
                                          list.questionNumber,
                                          key
                                        )
                                      }
                                      key="removeOption"
                                      style={{
                                        marginBottom: "10px",
                                        borderRadius: "4px",
                                        backgroundColor: "RED",
                                        color: "white",
                                        padding: "5px",
                                      }}
                                    >
                                      Remove Option
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                          <div
                            key={list.questionNumber}
                            style={{ marginTop: "20px" }}
                          >
                            <span style={{ marginRight: "10px" }}>Answer</span>

                            <input
                              type="text"
                              maxLength={1}
                              placeholder="Enter correct answer index"
                              onChange={(e) =>
                                handleAnswersChange(list.questionNumber, e)
                              }
                              style={{
                                marginBottom: "20px",
                                borderRadius: "4px",
                                height: "30px",
                                padding: "5px",
                              }}
                            />
                          </div>

                          <button
                            onClick={() =>
                              handleRemoveQuesClick(list.questionNumber)
                            }
                            key="removeQues"
                            style={{
                              margin: "20px 0px",
                              borderRadius: "4px",
                              backgroundColor: "red",
                              color: "white",
                              padding: "5px",
                              marginLeft: "370px",
                            }}
                          >
                            Remove Question
                          </button>
                        </div>

                        {/* border */}
                        <div
                          style={{
                            width: "500px",
                            height: "5px",
                            backgroundColor: "white",
                            marginTop: "15px",
                          }}
                        />
                      </div>
                    );
                  })}
              </div>

              {/* border */}
              <div
                style={{
                  width: "671px",
                  height: "1px",
                  backgroundColor: "white",
                  position: "absolute",
                  left: "27.9%",
                  marginTop: "10px",
                }}
              />

              {/* border */}
              <div
                style={{
                  width: "671px",
                  height: "1px",
                  backgroundColor: "white",
                  position: "absolute",
                  left: "27.9%",
                  marginTop: "10px",
                }}
              />

              {!!errors && errors.length > 0 && !errors.includes("Testing") && (
                <div style={{ marginTop: "50px" }}>
                  <ul>
                    {errors.map((message) => {
                      return (
                        <li key={message} style={{ color: "red" }}>
                          {message}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "end" }}>
                <button
                  onClick={handleCreateQuizClick}
                  style={{
                    borderRadius: "4px",
                    padding: "10px 30px",
                    backgroundColor: "#588157",
                    color: "white",
                    fontSize: "16px",
                    marginTop: "20px",
                    marginBottom: "30px",
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;
