let todoList = {
    f: {
        actions: {}
    },
    defaults: {
        todoListKeyName: 'todo-list',
        lastIndexKeyName: 'last-index',
        elements: {
            todoListWrapper: document.getElementById('todoList-wrapper'),
            dataContainer: null,
        }
    },
    storage: {
        items: [],
        lastIndex: 0,
    }
};

todoList.f.loadTodoList = () => {
    let accessKey = todoList.defaults.todoListKeyName,
        lastIndexAccessKey = todoList.defaults.lastIndexKeyName,
        todoListItems = localStorage.getItem(accessKey),
        lastIndex = localStorage.getItem(lastIndexAccessKey);

    if (!todoListItems) {
        todoListItems = JSON.stringify(todoList.storage.items);
        lastIndex = 0;

        localStorage.setItem(
            accessKey,
            todoListItems
        );

        localStorage.setItem(
            lastIndexAccessKey,
            lastIndex.toString()
        );
    }

    todoList.storage.items = JSON.parse(todoListItems);
    todoList.storage.lastIndex = parseInt(lastIndex);

    console.log('todoList.loading.items', todoList.storage.items);
    console.log('todoList.loading.index', todoList.storage.lastIndex);
}

todoList.f.writeDataToLocalStorage = () => {
    let accessKey = todoList.defaults.todoListKeyName,
        lastIndexAccessKey = todoList.defaults.lastIndexKeyName;

    localStorage.setItem(accessKey, JSON.stringify(todoList.storage.items));
    localStorage.setItem(lastIndexAccessKey, todoList.storage.lastIndex.toString());

    todoList.storage.items = JSON.parse(localStorage.getItem(accessKey));
}

todoList.f.actions.list = targetElement => {
    targetElement.innerHTML = '';

    let listItemsContainer = document.createElement('ul'),
        items = todoList.storage.items;

    if (!items.length) {
        return;
    }

    listItemsContainer.classList.add('collection');

    for (let [, item] of Object.entries(items)) {
        let listItem = document.createElement('li'),
            deleteSpanElement = document.createElement('span');

        deleteSpanElement.classList.add('material-icons', 'cursor-pointer', 'right');
        deleteSpanElement.textContent = 'delete';
        deleteSpanElement.setAttribute('data-item-id', item.id);
        deleteSpanElement.addEventListener('click', () => todoList.f.actions.delete(item.id));

        listItem.classList.add('collection-item', 'word-breaker');
        listItem.textContent = item.text;
        listItem.setAttribute('data-item-id', item.id);

        listItem.appendChild(deleteSpanElement);

        listItemsContainer.appendChild(listItem);
    }

    targetElement.appendChild(listItemsContainer);
};

todoList.f.actions.create = textElement => {
    let textValue = textElement.value;

    if (textValue.length > 0) {
        M.toast({
            html: 'Успiшно додано',
            classes: ['white-text'].join(' ')
        });

        textElement.value = '';
        todoList.storage.lastIndex++;

        let todoListItemObject = {
            id: todoList.storage.lastIndex,
            text: textValue,
        };

        todoList.storage.items.push(todoListItemObject)

        todoList.f.writeDataToLocalStorage();
        todoList.f.actions.list(todoList.defaults.elements.dataContainer);

        textElement.focus();

        return;
    }

    M.toast({
        html: 'Текст повинен бути присутнiй',
        classes: ['white-text'].join(' ')
    });

    textElement.focus();
}

todoList.f.actions.delete = id => {
    for (let [index, item] of Object.entries(todoList.storage.items)) {
        if (item.id === id) {
            todoList.storage.items.splice(parseInt(index), 1);
            break;
        }
    }

    todoList.f.writeDataToLocalStorage();
    todoList.f.actions.list(todoList.defaults.elements.dataContainer);
}

todoList.f.actions.deleteAll = () => {
    todoList.storage.items = [];
    todoList.f.writeDataToLocalStorage();

    todoList.f.actions.list(todoList.defaults.elements.dataContainer);
}

todoList.f.makeForm = () => {
    let formParentContainer = document.createElement('div'),
        formDataContainer = document.createElement('div'),
        formActionButtonsContainer = document.createElement('div'),
        todoItemInputContainer = document.createElement('div'),
        todoItemTextInput = document.createElement('input'),
        createActionButton = document.createElement('button'),
        deleteAllActionButton = document.createElement('button');

    formParentContainer.classList.add('row');

    formDataContainer.classList.add('col', 's12');
    formDataContainer.setAttribute('id', 'todo-list-data-container');

    formActionButtonsContainer.classList.add('col', 's12');

    todoItemInputContainer.classList.add('input-field', 'col', 's12');

    todoItemTextInput.setAttribute('id', 'todo-item-text');
    todoItemTextInput.setAttribute('placeholder', 'Текст Завдання');

    todoItemTextInput.addEventListener('keyup', e => {
        switch (e.key) {
            case 'Enter':
                todoList.f.actions.create(todoItemTextInput);
                break;
        }
    });

    todoItemInputContainer.append(todoItemTextInput);

    createActionButton.innerText = 'Додати Завдання до Списку';
    deleteAllActionButton.innerText = 'Видалити Все';

    createActionButton.classList.add('btn', 'col', 's12');
    deleteAllActionButton.classList.add('btn', 'col', 's12', 'mt1');

    createActionButton.addEventListener('click', () => todoList.f.actions.create(todoItemTextInput));
    deleteAllActionButton.addEventListener('click', () => todoList.f.actions.deleteAll());

    formActionButtonsContainer.append(
        todoItemInputContainer,
        createActionButton,
        deleteAllActionButton
    );

    formParentContainer.append(
        formDataContainer,
        formActionButtonsContainer
    );

    todoList.defaults.elements.todoListWrapper.append(formParentContainer);
    todoList.defaults.elements.dataContainer = formDataContainer;
};

todoList.f.init = () => {
    todoList.f.loadTodoList();
    todoList.f.makeForm();
    todoList.f.actions.list(todoList.defaults.elements.dataContainer);
};

window.todoList = todoList;
window.addEventListener('DOMContentLoaded', () => todoList.f.init());