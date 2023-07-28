// making the html template visible using OOP 
// in this class our goal is to access the template in html and render in <div id="app"></div> in file index.html
class ProjectInput{
  // everything inside <template>
  templateElement:HTMLTemplateElement;

  // <div id="app"></div>
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


    this.titleInputElement= document.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement= document.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement= document.querySelector('#people') as HTMLInputElement;

    this.configure()
    this.attach()
  }
  private submitHandler(event:Event){
    event.preventDefault();
    console.log(this.titleInputElement.value)

  }
  // setting event listener need to bind because the "this" in configure refers to this in submithandler
  private configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this))

  }
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
    
  }
}

const prjInput = new ProjectInput()