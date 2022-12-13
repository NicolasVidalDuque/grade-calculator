function addAssignment(text){
    if (!assignmentNameVerification(text)){
        return;
    }
    const list = document.querySelector('#main-list');
    const assignmentName = document.querySelector('#name-input').value;
    const newElement = createAssignment(assignmentName);
    list.appendChild(newElement);
    nameInput.value = '';
}

function createAssignment(assignmentName){
    assignmentName = textConvert(assignmentName)
    const element = document.createElement('li');
    element.setAttribute('id','grade-'+assignmentName);
    element.setAttribute('class','assignment-item');
    element.innerHTML=`
                        <div class="content-container">
                            <h4 class="assignment-name">${assignmentName}</h4>
                            <div class="input-container">
                                <input class="assignment-weight" placeholder="Weight [%]">
                                <input class="assignment-grade" placeholder="Grade [5]">
                            </div>
                        </div>
                        <div class="button-container">
                            <button class="delete-button">D</button>
                        </div>
                        `;
    return element;
}

function assignmentNameVerification(text){
    if (text === ''){
        return false;
    }
    return true;
}

function deletElement(event){
    const button = event.target;
    const li = button.parentNode.parentNode;
    const ul = li.parentNode;

    ul.removeChild(li);
}

function textConvert(text){
    return text.replaceAll(' ','_');
}

function getData(){
    const list = document.querySelector('#main-list').children;
    const assignmentDictionary = {};
    let assignmentGrade = 0;
    let assignmentName = '';
    let assignmentWeight = 0;
    for (let i = 0; i < list.length; i++){
        const element = list.item(i)
        assignmentName = element.querySelector('h4').innerHTML;
        assignmentGrade = element.querySelector('.assignment-grade').value;
        assignmentWeight = element.querySelector('.assignment-weight').value;

        assignmentDictionary[assignmentName] = [assignmentWeight, assignmentGrade];
    };
    return assignmentDictionary
}
function calculate(){
    const assignmentDictionary = getData();
    if (!gradeDataVerification(assignmentDictionary)){
        return;
    }
    let result = calculation(assignmentDictionary);
    window.alert(result.toFixed(3))
}

function calculation(assignmentDictionary){
    /*
        wg = weight * grade of every assignment without x
        wx = weight of assignments that have an x 
    */
   const targetGrade = Number(document.querySelector('.target-grade-input').value);
   let wx = 0;
   let wg = 0;
    for (const [key, value] of Object.entries(assignmentDictionary)){
        let grade = value[1];
        let weight = Number(value[0]);

        if (grade === 'x' || grade === 'X'){
            wx += weight/100;
        }else{
            wg += (weight/100) * Number(grade);
        }
    }
    return ((targetGrade-wg)/wx);
}

function gradeDataVerification(assignmentDictionary){
    let totalWeight = 0;
    const targetGrade = document.querySelector('.target-grade-input').value
    for (const [key, value] of Object.entries(assignmentDictionary)){
        let grade = value[1];
        let weight = value[0];
        if (grade === '' || weight === ''){
            window.alert(`Assignment: "${key.toUpperCase()}" has BLANK SPACE`);
            return false;
        }
        if (isNaN(grade)){
            if (grade.toUpperCase() !== 'X'){
                window.alert(`Assignment: "${key.toUpperCase()}" has a NON NUMERIC grade`);
                return false;
            }
        }
        if (isNaN(weight)){
            window.alert(`Assignment: "${key.toUpperCase()}" has a NON NUMERIC weight`);
            return false;
        }
        if (grade < 0 || grade > 5){
            window.alert(`Assignment: "${key.toUpperCase()}" has to have a grade in between [0-5]`);
            return false;
        }
        if (weight < 0 || weight > 100){
            window.alert(`Assignment: "${key.toUpperCase()}" has to have a weight in between [0-100]`);
            return false;
        }
        totalWeight += Number(weight);
    }
    if (totalWeight !== 100){
        window.alert('All weight`s must add up to a 100%');
        return false;
    }
    if (isNaN(targetGrade)){
        window.alert('The TARGET GRADE must be a number')
        return false;
    }
    if (targetGrade < 0 || targetGrade > 5){
        window.alert(`The TARGET GRADE must be in between [0-5]`);
        return false;
    }
    return true;
}

const addButton = document.querySelector('#add-button');
const calcButton = document.querySelector('#calculate-button');
const nameInput = document.querySelector('#name-input');
const listDiv = document.querySelector('#list-div');

calcButton.addEventListener('click', () =>{
    calculate();
})

addButton.addEventListener('click', () =>{
    addAssignment(nameInput.value);
})

nameInput.addEventListener('keyup', (event) =>{
    if (event.which !== 13){
        return;
    }
    addAssignment(nameInput.value);
})

listDiv.addEventListener('click', (event) =>{
    if (event.target.tagName !== 'BUTTON'){
        return;
    }
    deletElement(event);
})

