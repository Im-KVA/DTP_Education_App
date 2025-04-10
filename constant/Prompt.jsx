import dedent from "dedent";

export default {
  IDEA: dedent`:As you are a coaching teacher
    - User want to learn about the topic
    - Generate 5-7 Course title for study
    - Make sure it is related to description
    - Output will be ARRAY of String in JSON FORMAT only and must be Vietnamese
    - Do not add any plain text in output or the outside of output
    - example good output: [
  "Tiếng Pháp cho người mới bắt đầu: Làm quen và giao tiếp cơ bản",
  "Chinh phục Tiếng Pháp A1-A2: Xây dựng nền tảng vững chắc",
  "Giao tiếp Tiếng Pháp tự tin: Thực hành tình huống hàng ngày",
  "Ngữ pháp Tiếng Pháp ứng dụng: Từ lý thuyết đến thực hành",
  "Khám phá văn hóa Pháp qua ngôn ngữ: Hiểu sâu hơn về nước Pháp",
  "Luyện nghe nói Tiếng Pháp hiệu quả: Cải thiện kỹ năng giao tiếp",
  "Tiếng Pháp du lịch: Tự tin khám phá các quốc gia nói tiếng Pháp"
]`,

  DOC: dedent`: As you are coaching teacher
    - User want to learn about all topics
    - Create 2 to 3 Courses With Course Name, Description, and 5 to 8 Chapters in each course
    - Make sure to add chapters 
    - List Content in each chapter along with Description in 5 to 8 lines
    - Do not Just Explain what chapter about, Explain in Detail with Example
    - Also Make Easy, Moderate and Advance Course depends on topics
    - Add CourseBanner Image from ('/banner1.png','/banner2.png','/banner3.png','/banner4.png','/banner5.png','/banner6.png'), select It randomly
    - Explain the chapter content as detailed tutorial with list of content
    - Generate 10 Quizz, 10 Flashcard and 10 Questions answer
    - Tag each course to one of the categorty from :["Tech & Coding","Business & Finance","Health & Fitness","Science & Engineering","Arts & Creativity"]
    - Output in JSON Format only and must be Vietnamese
    - Alway check for any SyntaxError in output
    -  "docs": [
  {
    "Title": '<Intro to Python>',
    "description": '',
    "banner_image": "/banner1.png",
    "category":"",
    "chapters": [
      {
        chapterName: '',
        content: [
          {
            topic: '<Topic Name in 2 to 4 worlds ex.(Creating Variables)>'
            explain: '< Detailed Explaination in 5 to 8 Lines if required>',
            code: '<Code example of required else null',
            example: '< example of required else null'
          },
          
            ...
          
        ]
      }
    ],
    quiz:[
      {
        question:'',
        options:['a',b,c,d],
        correctAns:''
      }
    ],
    flashcards:[
      {
        front:'',
        back:''
      }
    ],
    qa:[
      {
        question:'',
        answer:''
      }
    ]
  }
]
    `,
};
