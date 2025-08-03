class Option {
  constructor(value, text, selected = false) {
    this.value = value;
    this.text = text;
    this.selected = selected;
  }
}

class Multiselect {
  selectedOptions = [];

  constructor(config) {
    this.parentContainer = config.parentContainer;
    this.options = config.options;
    this.placeholder = config.placeholder;
    this.init();
  }

  init() {
    console.log("Multiselect initialized in", this.parentContainer);
    this.template = this.loadTemplate();
    this.selectedOptionsContainer = this.template.querySelector(
      '[data-template="multiselect-selectedOptionsContainer"]'
    );
    this.selectContainer = this.template.querySelector(
      '[data-template="multiselect-optionContainer"]'
    );
    this.placeholderContainer = this.selectContainer.querySelector(
      '[data-template="placeholder"]'
    );
    this.placeholderContainer.textContent =
      this.placeholder || "Select options";
    this.initializeOptions();
    this.selectContainer.addEventListener(
      "change",
      this.selectChangeHandler.bind(this)
    );
    this.parentContainer.appendChild(this.template);
  }

  loadTemplate() {
    return document
      .getElementById("multiselect-template")
      .content.cloneNode(true);
  }

  createOption(value, text, selected = false) {
    const option = document.createElement("option");
    option.value = value;
    option.dataset.value = value;
    option.dataset.selected = selected;

    // const checkbox = document.createElement("input");
    // checkbox.type = "radio";
    // checkbox.selected = selected;

    const label = document.createElement("span");
    label.textContent = text;

    // option.appendChild(checkbox);
    option.appendChild(label);
    return option;
  }

  initializeOptions() {
    this.options.forEach((option) => {
      const optionElement = this.createOption(
        option.value,
        option.text,
        option.selected
      );
      this.selectContainer.appendChild(optionElement);
    });
  }

  selectChangeHandler(event) {
    console.log(event);
    let selected = Array.from(this.selectContainer.selectedOptions);

    
    if(selected[0].value === "all") {
        selected = Array.from(this.selectContainer.options).filter(
          (option) => option.value !== "all"
        );
    }
    this.selectedOptions.push(...selected.map((option) => option.value));
    console.log("Selected options:", this.selectedOptions);
    this.resetSelectedOptions();
  }

  resetSelectedOptions() {
    Array.from(this.selectContainer.selectedOptions).forEach((option) => {
      option.selected = false;
    });
    this.placeholderContainer.selected = true;
  }
}
