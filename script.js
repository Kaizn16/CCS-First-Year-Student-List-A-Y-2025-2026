document.addEventListener('DOMContentLoaded', () => {

const listContainer = document.getElementById('student-list-body');
const sectionTitle = document.getElementById('section-title');
const buttons = {
    A: document.getElementById('btn-secA'),
    B: document.getElementById('btn-secB'),
    C: document.getElementById('btn-secC'),
    D: document.getElementById('btn-secD'),
    E: document.getElementById('btn-secE'),
};
const allButtons = Object.values(buttons);

fetch('students.json')
    .then(response => response.json())
    .then(data => { 
        const renderStudentList = (studentData, sectionName) => {
            sectionTitle.textContent = `1st Year Student List: Section ${sectionName}`;
            listContainer.innerHTML = '';

            studentData.forEach((student, index) => {
                const row = document.createElement('tr');
                const courseClass = student.course.toLowerCase() === 'bsit' ? 'bsit' : 'bscs';
                row.innerHTML = `
                    <td data-label="#">${index + 1}</td>
                    <td data-label="Full Name">${student.lastName}, ${student.firstName} ${student.middleName || ''}</td>
                    <td data-label="Course"><span class="course-tag ${courseClass}">${student.course}</span></td>
                `;
                listContainer.appendChild(row);
            });
        };

        const handleSectionChange = (sectionKey) => {
            allButtons.forEach(button => button.classList.remove('active'));
            buttons[sectionKey].classList.add('active');
            renderStudentList(data[sectionKey], sectionKey);
        };

        buttons.A.addEventListener('click', () => handleSectionChange('A'));
        buttons.B.addEventListener('click', () => handleSectionChange('B'));
        buttons.C.addEventListener('click', () => handleSectionChange('C'));
        buttons.D.addEventListener('click', () => handleSectionChange('D'));
        buttons.E.addEventListener('click', () => handleSectionChange('E'));

        handleSectionChange('A');

    })
    .catch(error => {
        console.error('Error loading student data:', error);
        sectionTitle.textContent = 'Error: Could not load data!';
    });
});
