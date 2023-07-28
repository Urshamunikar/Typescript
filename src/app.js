// making the html template visible using OOP 
// in this class our goal is to access the template in html and render in <div id="app"></div> in file index.html
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        // this.templateElement= <HTMLTemplateElement>document.getElementById('project-input')! or 
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        var importHTMLContent = document.importNode(this.templateElement.content, true);
        // this is the form element
        this.element = importHTMLContent.firstElementChild;
        // adding id to the element <form> using dom
        this.element.id = 'user-input';
        this.titleInputElement = document.querySelector('#title');
        this.descriptionInputElement = document.querySelector('#description');
        this.peopleInputElement = document.querySelector('#people');
        this.configure();
        this.attach();
    }
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
    };
    // setting event listener need to bind because the "this" in configure refers to this in submithandler
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    };
    ProjectInput.prototype.attach = function () {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    };
    return ProjectInput;
}());
var prjInput = new ProjectInput();
