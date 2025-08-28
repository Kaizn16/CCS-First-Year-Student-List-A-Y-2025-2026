document.addEventListener('DOMContentLoaded', () => {

    const listContainer = document.getElementById('student-list-body');
    const sectionTitle = document.getElementById('section-title');
    const searchInput = document.getElementById('search-input');
    const buttons = {
        A: document.getElementById('btn-secA'),
        B: document.getElementById('btn-secB'),
        C: document.getElementById('btn-secC'),
        D: document.getElementById('btn-secD'),
        E: document.getElementById('btn-secE'),
    };
    const allButtons = Object.values(buttons);

    let allStudentData = {};
    let currentSectionKey = 'A';

    fetch('students.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allStudentData = data; 

            const renderStudentList = (studentData, sectionName) => {
                
                listContainer.innerHTML = ''; 

                
                if (!studentData || studentData.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="3" class="no-results">No students found.</td>`;
                    listContainer.appendChild(row);
                    return;
                }

                studentData.forEach((student, index) => {
                    const row = document.createElement('tr');
                    
                    const courseClass = `${student.course.toLowerCase()}`;
                    row.innerHTML = `
                        <td data-label="#">${index + 1}</td>
                        <td data-label="Full Name">${student.lastName}, ${student.firstName} ${student.middleName ? student.middleName[0] + '.' : ''}</td>
                        <td data-label="Course"><span class="course-tag ${courseClass}">${student.course}</span></td>
                    `;
                    listContainer.appendChild(row);
                });
            };

            const handleSectionChange = (sectionKey) => {
                currentSectionKey = sectionKey; 
                allButtons.forEach(button => button.classList.remove('active'));
                buttons[sectionKey].classList.add('active');
                searchInput.value = ''; 
                renderStudentList(allStudentData[sectionKey], sectionKey);
            };

            
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                const currentSectionData = allStudentData[currentSectionKey] || [];
                
                const filteredData = currentSectionData.filter(student => {
                    const fullName = `${student.firstName} ${student.middleName || ''} ${student.lastName}`.toLowerCase();
                    return fullName.includes(searchTerm);
                });
                
                renderStudentList(filteredData);
            });

            Object.keys(buttons).forEach(key => {
                buttons[key].addEventListener('click', () => handleSectionChange(key));
            });

            handleSectionChange('A');

        })
        .catch(error => {
            console.error('Error loading student data:', error);
            sectionTitle.textContent = 'Error: Could not load data!';
            listContainer.innerHTML = '<tr><td colspan="3" class="no-results">Failed to load student data. Please check the file path and ensure `students.json` is valid.</td></tr>';
        });
});