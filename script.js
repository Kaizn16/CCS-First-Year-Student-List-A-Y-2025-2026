document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.querySelector('.container');
    const listContainer = document.getElementById('student-list-body');
    const sectionTitle = document.getElementById('section-title');
    const searchInput = document.getElementById('search-input');
    const countOverallStudents = document.getElementById('overall-students')
    const bsitTotalElement = document.getElementById('bsit-total');
    const bscsTotalElement = document.getElementById('bscs-total');
    
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

    /**
     * Calculates the grand total of students per course from the entire dataset
     * and updates the display. This function is called only once.
     * @param {object} studentData
     */
    const calculateAndDisplayOverallTotals = (studentData) => {
        const allStudents = Object.values(studentData).flat();
        const bsitCount = allStudents.filter(student => student.course === 'BSIT').length;
        const bscsCount = allStudents.filter(student => student.course === 'BSCS').length;

        bsitTotalElement.textContent = `BSIT - ${bsitCount}`;
        bscsTotalElement.textContent = `BSCS - ${bscsCount}`;
        countOverallStudents.textContent = `Students: ${bsitCount + bscsCount}`;
    };

    fetch('students.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allStudentData = data;
            

            calculateAndDisplayOverallTotals(allStudentData);
            
            
            handleSectionChange('A');

            setTimeout(() => {
                container.classList.add('loaded');
            }, 100); 
        })
        .catch(error => {
            console.error('Error loading student data:', error);
            sectionTitle.textContent = 'Error: Could not load data!';
            listContainer.innerHTML = '<tr><td colspan="3" class="no-results">Failed to load student data. Please check the file and path.</td></tr>';
            container.classList.add('loaded');
        });

    /**
     * Renders the student list for the current section.
     * @param {Array} studentData
     */
    const renderStudentList = (studentData) => {
        listContainer.innerHTML = ''; 

        if (!studentData || studentData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="no-results">No students found.</td>`;
            listContainer.appendChild(row);
            return;
        }

        studentData.forEach((student, index) => {
            const row = document.createElement('tr');
            const courseClass = student.course.toLowerCase();

            row.innerHTML = `
                <td data-label="#">${index + 1}</td>
                <td data-label="Full Name">${student.student_name}</td>
                <td data-label="Course"><span class="course-tag ${courseClass}">${student.course}</span></td>
            `;

            row.classList.add('row-animation');
            row.style.animationDelay = `${index * 50}ms`;

            listContainer.appendChild(row);
        });
    };

    const applyFilterAndRender = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        const currentSectionData = allStudentData[currentSectionKey] || [];
        
        const sectionFilteredData = currentSectionData.filter(student => {
            const fullName = `${student.student_name}`.toLowerCase();
            const course  = `${student.course}`.toLocaleLowerCase();
            return fullName.includes(searchTerm) || course.includes(searchTerm);
        });

        renderStudentList(sectionFilteredData);
    };

    const handleSectionChange = (sectionKey) => {
        currentSectionKey = sectionKey;
        allButtons.forEach(button => button.classList.remove('active'));
        buttons[sectionKey].classList.add('active');
        applyFilterAndRender();
    };

    
    searchInput.addEventListener('input', applyFilterAndRender);

    Object.keys(buttons).forEach(key => {
        buttons[key].addEventListener('click', () => handleSectionChange(key));
    });
});