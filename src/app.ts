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
      console.log(userInput);
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

    constructor(private type : 'active' | 'finished'){
      this.templateElement= document.getElementById("project-list")! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;
  
      const importedNode = document.importNode(this.templateElement.content, true)
  
      // this is the first element inside the template i.e from line 33 to 38
      this.element= importedNode.firstElementChild as HTMLElement
      this.element.id = `${this.type}-projects`
      this.attach();
      this.renderContent();  
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
