Tom is a professional JS lecturer who loves his students very much.
Unfortunately, Tom had to move to Thailand with his wife.
Tom wants to keep following his students' progress in their journey of becoming a JS master just like him!

Help Tom create an online coding web application with the following pages and features:
Lobby page (no need for authentication) :
The page should contain the title “Choose code block” and a list of at least 4 items that represent code blocks, each item can be represented by a name (for example - “Async case”)
Clicking on an item should redirect users to the corresponding code block page -
Code block page :
Contains the title and a text editor with the code block initial template and a role indicator (student/mentor).
Assume that the first user who opens the code block page is the mentor (Tom), after that, any other client will be counted as a student.
If Tom leaves the code-block page, students should be redirected to the lobby page, and any written code should be deleted.
The mentor will see the selected code block in a read-only mode.
The student will see the code block with the ability to change the code
Code changes should be displayed in real-time (Socket)
The code should have syntax highlighting
At any given time, each user can see how many students are in the room
Have a “solution” on a codeblock object (also insert manually), once the student changes the code to be equal to the solution, show a big smiley face on the screen :)
