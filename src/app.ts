enum ProjectStatus{
  Active, 
  Finished
}
// creating a class type instead of type or interface so that it can be extended
class Project{
  // by giving public infront of variable it creates properties and assiging both
  constructor(public id: string, public title: string, public description:string, public people:number,  public status:ProjectStatus){}
}
type Listener = (item:Project[]) => void;

// creating a global class for state managing i.e exchanging variables and methods in different class
// for example getting access to userinput 

class ProjectState{
  // adding listener wherenever something changes
  private listeners: Listener[]= [];
  private projects:Project[]=[];
  // creating a private static instance of projectState
  private static instance: ProjectState
  // constructor is needed for creating a new object
  private constructor(){}

  // this assure that if there is instance created then returing that instance otherwise creating a new object of projectState and return it
  static getInstance(){
    if(this.instance){
      return this.instance
    }
    this.instance = new ProjectState();
    return this.instance
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title:string, description:string, people:number){
    const newProject = new Project (
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    )
    this.projects.push(newProject)

    for(const listenersFn of this.listeners){
      // using slice because sending the copy of array as array is reference type and we don't want it to be changed from other side
      listenersFn(this.projects.slice())
    }
  }

}
// using instance of class to assure that there is only one instance of that class (ProjectState)
const prjState = ProjectState.getInstance();

// validating user input
interface Validatable {
  value: string | number,
  required?: boolean,
  maxLength?: number,
  minLength?: number,
  max?: number,
  min?: number,
}
function validate(validatableInput: Validatable){
  let isValid = true;
  if(validatableInput.required){
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if(
    validatableInput.minLength != null && typeof validatableInput.value === "string"
  ){
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength
  }
  if(
    validatableInput.maxLength != null && typeof validatableInput.value === "string"
  ){
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
  }
  if(
    validatableInput.min != null && typeof validatableInput.value === "number"
  ){
    isValid = isValid && validatableInput.value >= validatableInput.min
  }  
  if(
    validatableInput.max != null && typeof validatableInput.value === "number"
  ){
    isValid = isValid && validatableInput.value <= validatableInput.max
  }
  return isValid

}
// autobind decorator
// _ and _2 tells the typescript u are aware about the unused parameters but then u need to accept that because of some reason
function autobind(_:any, _2:string, descriptor:PropertyDescriptor){
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;

}
// making the html template visible using OOP 
// in this class our goal is to access the template in html and render in <div id="app"></div> in file index.html
// project input class for rendering form and gathering user input 
class ProjectInput{
  // everything inside <template>
  templateElement:HTMLTemplateElement;

  // <div id="app"></div> is where you wanna display
  hostElement: HTMLDivElement;

  // everything inside <form>
  element:HTMLFormElement;

// get access to different input field in that form and store as property of the class
  // for title which is inside form
  titleInputElement:HTMLInputElement;

  // for description which is inside form
  descriptionInputElement:HTMLInputElement;

  // for people which is inside form
  peopleInputElement:HTMLInputElement;


  constructor(){
    // this.templateElement= <HTMLTemplateElement>document.getElementById('project-input')! or 
    this.templateElement= document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importHTMLContent = document.importNode(this.templateElement.content, true)

    // this is the form element
    this.element= importHTMLContent.firstElementChild as HTMLFormElement
    // adding id to the element <form> using dom
    this.element.id = 'user-input'


    this.titleInputElement= this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement= this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement= this.element.querySelector('#people') as HTMLInputElement;

    this.configure()
    this.attach()
  }
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
      const[title, description, people] = userInput;
      prjState.addProject(title, description, people);
      this.clearInputs()
    }
  }
  private gatherUserInput():[string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionInputElement.value
    const enteredPeople = this.peopleInputElement.value

    const titleValidate: Validatable = {
      value: enteredTitle,
      required:true,
      minLength:5
    }  
      const descriptionValidate: Validatable = {
      value: enteredDescription,
      required:true,
      minLength:15
    }  
      const peopleValidate: Validatable = {
      value: enteredPeople,
      required:true,
      min:1,
      max:20
    }
    if(!validate(titleValidate)|| !validate(descriptionValidate) || !validate(peopleValidate)){
      alert("Invalid value")
      return;
    }else{
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  private clearInputs(){
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }


  // setting event listener need to bind because the "this" in configure refers to this in submithandler
  private configure() {
    this.element.addEventListener('submit', this.submitHandler);

  }
  // attach list to DOM
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
    
  }
}

// project list class for rendering list of project 
class ProjectList{
    // everything inside <template> line : 32
    templateElement:HTMLTemplateElement;

    // <div id="app"></div> is where you wanna display
    hostElement: HTMLDivElement;
  
    // everything inside <section> since there is no type for HTML section so simply HTMLElement
    element:HTMLElement;

    assignedProjects:any[];

    constructor(private type : 'active' | 'finished'){
      this.templateElement= document.getElementById("project-list")! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;
      this.assignedProjects=[]
  
      const importedNode = document.importNode(this.templateElement.content, true)
  
      // this is the first element inside the template i.e from line 33 to 38
      this.element= importedNode.firstElementChild as HTMLElement
      this.element.id = `${this.type}-projects`
      // adding listener
      prjState.addListener((projects:Project[]) => {
        this.assignedProjects = projects
        this.renderProjects()

      })
      this.attach();
      this.renderContent();  
    }
    private renderProjects (){
      const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
      for(const prjItem of this.assignedProjects){
        const listItem = document.createElement('li');
        listItem.textContent = prjItem.title;
        listEl.appendChild(listItem)
      }

    }
    // displaying the list content in different tags like h2, ul
    private renderContent(){
      const listId = `${this.type}-projects-list`
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
    }
    private attach() {
      this.hostElement.insertAdjacentElement('beforeend', this.element)
      
    }
  
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')
