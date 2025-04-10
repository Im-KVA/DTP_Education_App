import { useState } from "react";

const DocEditModal = ({ isOpen, onClose, docData, onSave }) => {
  const [activeTab, setActiveTab] = useState("title");

  const [title, setTitle] = useState(docData?.Title || "");
  const [description, setDescription] = useState(docData?.description || "");
  const [chapters, setChapters] = useState(docData?.chapters || []);
  const [flashcards, setFlashcards] = useState(docData?.flashcards || []);
  const [qa, setQa] = useState(docData?.qa || []);
  const [quiz, setQuiz] = useState(docData?.quiz || []);
  const [loading, setLoading] = useState(false);

  const handleSave = async (field) => {
    setLoading(true);
    try {
      let updatedData = {};
      switch (field) {
        case "title":
          updatedData = { Title: title };
          break;
        case "description":
          updatedData = { description };
          break;
        case "chapters":
          updatedData = { chapters };
          break;
        case "flashcards":
          updatedData = { flashcards };
          break;
        case "qa":
          updatedData = { qa };
          break;
        case "quiz":
          updatedData = { quiz };
          break;
        default:
          return;
      }

      await onSave(updatedData);
      alert("Lưu thành công!");
    } catch (err) {
      alert("Lỗi khi lưu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "title":
        return (
          <div>
            <div style={{ marginBottom: 5, fontWeight: "bold" }}>Tiêu đề:</div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
            <button
              onClick={() => handleSave("title")}
              style={saveBtnStyle}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        );

      case "description":
        return (
          <div>
            <div style={{ marginBottom: 5, fontWeight: "bold" }}>Mô tả:</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={textareaStyle}
            />
            <button
              onClick={() => handleSave("description")}
              style={saveBtnStyle}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        );

      case "chapters":
        return (
          <div>
            {chapters.map((ch, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 20,
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                }}
              >
                <div style={{ marginBottom: 5, fontWeight: "bold" }}>
                  Chương {i + 1}:
                </div>
                <input
                  type="text"
                  value={ch.chapterName}
                  onChange={(e) =>
                    updateList(setChapters, chapters, i, {
                      ...ch,
                      chapterName: e.target.value,
                    })
                  }
                  placeholder="Tên chương"
                  style={inputStyle}
                />

                <div style={{ marginTop: 10, fontWeight: "bold" }}>
                  Nội dung:
                </div>

                {(Array.isArray(ch.content) ? ch.content : []).map(
                  (item, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#f9f9f9",
                        padding: 10,
                        borderRadius: 8,
                        marginTop: 10,
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={() => {
                          const updatedContent = [...ch.content];
                          updatedContent.splice(index, 1);
                          updateList(setChapters, chapters, i, {
                            ...ch,
                            content: updatedContent,
                          });
                        }}
                        style={{
                          marginBottom: 5,
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: 15,
                          padding: 5,
                          cursor: "pointer",
                        }}
                        title="Xoá nội dung"
                      >
                        Xóa nội dung này 👇
                      </button>

                      <input
                        type="text"
                        placeholder="Chủ đề"
                        value={item.topic || ""}
                        onChange={(e) => {
                          const updatedContent = [...ch.content];
                          updatedContent[index].topic = e.target.value;
                          updateList(setChapters, chapters, i, {
                            ...ch,
                            content: updatedContent,
                          });
                        }}
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        placeholder="Giải thích"
                        value={item.explain || ""}
                        onChange={(e) => {
                          const updatedContent = [...ch.content];
                          updatedContent[index].explain = e.target.value;
                          updateList(setChapters, chapters, i, {
                            ...ch,
                            content: updatedContent,
                          });
                        }}
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        placeholder="Ví dụ"
                        value={item.example || ""}
                        onChange={(e) => {
                          const updatedContent = [...ch.content];
                          updatedContent[index].example = e.target.value;
                          updateList(setChapters, chapters, i, {
                            ...ch,
                            content: updatedContent,
                          });
                        }}
                        style={inputStyle}
                      />
                      <textarea
                        placeholder="Code"
                        value={item.code || ""}
                        onChange={(e) => {
                          const updatedContent = [...ch.content];
                          updatedContent[index].code = e.target.value;
                          updateList(setChapters, chapters, i, {
                            ...ch,
                            content: updatedContent,
                          });
                        }}
                        style={{
                          ...inputStyle,
                          fontFamily: "monospace",
                          minHeight: 80,
                        }}
                      />
                    </div>
                  )
                )}

                <button
                  onClick={() => {
                    const updatedContent = [
                      ...(ch.content || []),
                      { topic: "", explain: "", example: "", code: "" },
                    ];
                    updateList(setChapters, chapters, i, {
                      ...ch,
                      content: updatedContent,
                    });
                  }}
                  style={{ ...saveBtnStyle, marginTop: 10 }}
                >
                  ➕ Thêm nội dung
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setChapters([...chapters, { chapterName: "", content: [] }])
              }
              style={saveBtnStyle}
            >
              ➕ Thêm chương
            </button>

            <button
              onClick={() => handleSave("chapters")}
              style={saveBtnStyle}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        );

      case "flashcards":
        return (
          <div>
            {flashcards.map((fc, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ marginBottom: 5, fontWeight: "bold" }}>
                  Flashcard {i + 1}:
                </div>
                <div style={{ marginLeft: 15, marginTop: 5, marginBottom: 5 }}>
                  Mặt trước (font):
                </div>
                <input
                  type="text"
                  value={fc.front}
                  onChange={(e) =>
                    updateList(setFlashcards, flashcards, i, {
                      ...fc,
                      front: e.target.value,
                    })
                  }
                  placeholder="Mặt trước"
                  style={inputStyle}
                />
                <div style={{ marginLeft: 15, marginTop: 5, marginBottom: 5 }}>
                  Mặt sau (back):
                </div>
                <input
                  type="text"
                  value={fc.back}
                  onChange={(e) =>
                    updateList(setFlashcards, flashcards, i, {
                      ...fc,
                      back: e.target.value,
                    })
                  }
                  placeholder="Mặt sau"
                  style={inputStyle}
                />
              </div>
            ))}
            <button
              onClick={() =>
                setFlashcards([...flashcards, { front: "", back: "" }])
              }
              style={saveBtnStyle}
            >
              ➕ Thêm flashcard
            </button>
            <button
              onClick={() => handleSave("flashcards")}
              style={saveBtnStyle}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        );

      case "qa":
        return (
          <div>
            {qa.map((item, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ marginBottom: 10, fontWeight: "bold" }}>
                  Câu hỏi {i + 1}:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <p style={{ minWidth: 70 }}>Câu hỏi: </p>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) =>
                      updateList(setQa, qa, i, {
                        ...item,
                        question: e.target.value,
                      })
                    }
                    placeholder="Câu hỏi"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <p style={{ minWidth: 70 }}>Đáp án: </p>
                  <textarea
                    type="text"
                    value={item.answer}
                    onChange={(e) =>
                      updateList(setQa, qa, i, {
                        ...item,
                        answer: e.target.value,
                      })
                    }
                    placeholder="Trả lời"
                    style={{ ...inputStyle, minHeight: 80 }}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => setQa([...qa, { question: "", answer: "" }])}
              style={saveBtnStyle}
            >
              ➕ Thêm QA
            </button>
            <button
              onClick={() => handleSave("qa")}
              style={saveBtnStyle}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        );

      case "quiz":
        return (
          <div>
            {quiz.map((item, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ marginBottom: 10, fontWeight: "bold" }}>
                  Câu hỏi {i + 1}:
                </div>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) =>
                    updateList(setQuiz, quiz, i, {
                      ...item,
                      question: e.target.value,
                    })
                  }
                  placeholder="Câu hỏi"
                  style={inputStyle}
                />
                <div style={{ marginBottom: 5, marginLeft: 10 }}>
                  ⭐ Đáp án đúng:
                </div>
                <input
                  type="text"
                  value={item.correctAns}
                  onChange={(e) =>
                    updateList(setQuiz, quiz, i, {
                      ...item,
                      correctAns: e.target.value,
                    })
                  }
                  placeholder="Đáp án đúng"
                  style={inputStyle}
                />
                <div style={{ marginBottom: 5, marginLeft: 10 }}>
                  🎯 Lựa chọn:
                </div>
                {(item.options || []).map((opt, j) => (
                  <input
                    key={j}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updatedOptions = [...item.options];
                      updatedOptions[j] = e.target.value;
                      updateList(setQuiz, quiz, i, {
                        ...item,
                        options: updatedOptions,
                      });
                    }}
                    placeholder={`Lựa chọn ${j + 1}`}
                    style={inputStyle}
                  />
                ))}
              </div>
            ))}
            <button
              onClick={() =>
                setQuiz([
                  ...quiz,
                  {
                    question: "",
                    correctAns: "",
                    options: ["", "", "", ""],
                  },
                ])
              }
              style={saveBtnStyle}
            >
              ➕ Thêm câu hỏi trắc nghiệm
            </button>
            <button
              onClick={() => handleSave("quiz")}
              style={saveBtnStyle}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const updateList = (setFunc, list, index, newItem) => {
    const updated = [...list];
    updated[index] = newItem;
    setFunc(updated);
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={closeBtnStyle}>
          ❌
        </button>
        <h2>Chỉnh sửa tài liệu</h2>

        {/* Tabs */}
        <div style={tabMenuStyle}>
          {["title", "description", "chapters", "flashcards", "qa", "quiz"].map(
            (tab) => (
              <button
                key={tab}
                style={activeTab === tab ? tabActiveStyle : tabBtnStyle}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>

        <div style={{ marginTop: "20px" }}>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default DocEditModal;

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "700px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const closeBtnStyle = {
  float: "right",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
};

const tabMenuStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const tabBtnStyle = {
  padding: "8px 12px",
  backgroundColor: "#eee",
  border: "1px solid #ccc",
  borderRadius: "5px",
  cursor: "pointer",
};

const tabActiveStyle = {
  ...tabBtnStyle,
  backgroundColor: "#ddd",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};

const saveBtnStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
  marginRight: "10px",
  transition: "background-color 0.2s",
};

saveBtnStyle["&:hover"] = {
  backgroundColor: "#45a049",
};
