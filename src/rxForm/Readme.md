# Examples

## Simple usecase

```jsx
const { rxForm } = require('./index');

class SimpleForm extends React.Component {
    render() {
        return (
            <form>
                <div>
                    <input name="name" placeholder="enter your name" />
                </div>
                <div>
                    <input name="email" placeholder="modify your email" />
                </div>
                <div>
                    <button type="submit">Submit form</button>
                </div>
            </form>
        )
    }
}

const RxSimpleForm = rxForm({
    fields: {
        name: {
            value: 'John'
        },
        email: {
            value: (props) => props.foo
        }
    }
})(SimpleForm);

const onSubmit = (formValue) => {
    console.log('form submitted ===> ', formValue)
};

<RxSimpleForm foo="john.snow@nightwatch.com" onSubmit={onSubmit} />
```

## Email Validation

```jsx
const { rxForm } = require('./index');

class SimpleForm extends React.Component {
    render() {
        return (
            <form>
                <div>
                    <input name="email" placeholder="modify your email" />
                    { !!this.props.email.error &&
                        <div>
                            { this.props.email.error }
                        </div>
                    }
                </div>
                <div>
                    <button type="submit">Submit form</button>
                </div>
            </form>
        )
    }
}

const RxSimpleForm = rxForm({
    fields: {
        email: {
            value: (props) => props.foo,
            validation: (value) => {
                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (!emailRegex.test(value)) {
                    return 'you must enter a valid email'
                }
            }
        }
    }
})(SimpleForm);

const onSubmit = (formValue) => {
    console.log('form submitted ===> ', formValue)
};

const onError = (formValue) => {
    console.log('form error ===>', formValue)
};

<RxSimpleForm foo="john.snow.nightwatch.com" onSubmit={onSubmit} onError={onError} />
```

## Different password validation

```jsx
const { rxForm } = require('./index');

class SimpleForm extends React.Component {
    render() {
        return (
            <form>
                <div>
                    <input name="pass" type="password" placeholder="modify your password" />
                </div>
                <div>
                    <input name="repeatPass" type="password" placeholder="repeat your password" />
                    { !!this.props.repeatPass.error &&
                        <div>
                            { this.props.repeatPass.error }
                        </div>
                    }
                </div>
                <div>
                    <button type="submit">Submit form</button>
                </div>
            </form>
        )
    }
}

const RxSimpleForm = rxForm({
    fields: {
        pass: {},
        repeatPass: {
            validation: (value, { pass }) => {
                if (value.length > 0 && pass.length > 0) {
                    if (pass !== value) {
                        return 'password are not identical'
                    }
                }
            }
        }
    }
})(SimpleForm);

const onSubmit = (formValue) => {
    console.log('form submitted ===> ', formValue)
};

<RxSimpleForm onSubmit={onSubmit} />
```

## Async validation

```jsx
const { rxForm } = require('./index');
const { of } = require('rxjs');
const { ajax } = require('rxjs/ajax');
const { catchError, mapTo } = require('rxjs/operators');

class SimpleForm extends React.Component {
    render() {
        return (
            <form>
                <div>
                    <input name="githubUser" placeholder="enter a username" />
                    { this.props.githubUser.pending &&
                        <span>...loading</span>
                    }
                    { !!this.props.githubUser.error &&
                        <div>
                            { this.props.githubUser.error }
                        </div>
                    }
                </div>
                <div>
                    <button type="submit">Submit form</button>
                </div>
            </form>
        )
    }
}

const RxSimpleForm = rxForm({
    fields: {
        githubUser: {
            validation$: (value) => {
                return ajax(`https://api.github.com/users/${value}`).pipe(
                  mapTo('this user already exists'),
                  catchError(() => of(undefined)),
                )
            }
        }
    }
})(SimpleForm);

const onSubmit = (formValue) => {
    console.log('form submitted ===> ', formValue)
};

<RxSimpleForm onSubmit={onSubmit} />
```

## valueChange$ Observable

> check the console

```jsx
const { rxForm } = require('./index');
const MaskedInput = require('react-text-mask');

class SimpleForm extends React.Component {
    componentDidMount() {
        console.log(this.props)
        this.props.valueChange$.subscribe((formValues) => {
            console.log('Form values ====>', formValues)
        }, (err) => console.error(err))
    }

    render() {
        return (
            <form>
                <div>
                    <input name="email" placeholder="modify your email" />
                </div>
                <label htmlFor="remember">
                    Remember me ?
                    <input type="checkbox" name="remember" id="remenber" />
                </label>
                <div>
                    <label htmlFor="men">
                        Men
                        <input type="radio" name="gender" value="men" id="men" />
                    </label>
                    <label htmlFor="women">
                        Women
                        <input type="radio" name="gender" value="women" id="women" />
                    </label>
                </div>
                <div>
                    <MaskedInput.default name="mask" mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} />
                </div>
                <div>
                    <select name="country">
                        <option value="fr">France</option>
                        <option value="gl">Groland</option>
                    </select>
                </div>
                <div>
                    <input type="date" name="date" />
                </div>
                <div>
                    <input type="range" name="age" min="7" max="77" />
                </div>
                <div>
                    <input type="number" name="items" />
                </div>
                <div>
                    <button type="submit">Submit form</button>
                </div>
            </form>
        )
    }
}

const RxSimpleForm = rxForm({
    fields: {
        email: {},
        remember: {
            value: true,
        },
        gender: {
            value: 'women',
        },
        country: {
            value: 'gl',
        },
        date: {
            value: new Date()
        },
        age: {
            value: 60
        },
        items: {
            value: 45
        },
        mask: {
            value: '(324) 234-2423'
        }
    },
    valueChangeObs: true
})(SimpleForm);

const onSubmit = (formValue) => {
    console.log('form submitted ===> ', formValue)
};

<RxSimpleForm onSubmit={onSubmit} />
```

## debounce, throttle

```jsx
const { rxForm } = require('./index');

class SimpleForm extends React.Component {
    render() {
        return (
            <form>
                <div>
                    <input name="email" placeholder="modify your email" />
                    { !!this.props.email.error &&
                        <div>
                            { this.props.email.error }
                        </div>
                    }
                </div>
                <div>
                    <button type="submit">Submit form</button>
                </div>
            </form>
        )
    }
}

const RxSimpleForm = rxForm({
    fields: {
        email: {
            value: (props) => props.foo,
            validation: (value) => {
                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (!emailRegex.test(value)) {
                    return 'you must enter a valid email'
                }
            }
        }
    },
    debounce: 3000,
    throttle: 0
})(SimpleForm);

const onSubmit = (formValue) => {
    console.log('form submitted ===> ', formValue)
};

<RxSimpleForm foo="john.snow.nightwatch.com" onSubmit={onSubmit} />
```

## Custom input

```jsx
const { rxForm } = require('./index');
const { Editor, EditorState } = require('draft-js');


class CustomForm extends React.Component {
    handleDescriptionChange(description) {
        this.props.setValue({ description })
    }

    constructor(props) {
        super(props)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    }

    render() {
        console.log(this.props.description)
        return (
            <form>
                <div>
                    <input name="email" placeholder="modify your email" />
                </div>
                <div>
                    <Editor editorState={this.props.description.value} onChange={this.handleDescriptionChange} />
                </div>
                <div>
                    <button type="submit">Submit form</button>
                </div>
            </form>
        )
    }
}

const RxCustomForm = rxForm({
    fields: {
        email: {},
        description: {
            validation: (value) => {
                return 'EROROROROR'
                console.log('validation', value)
            },
            value: EditorState.createEmpty(),
            customInput: true
        }
    }
})(CustomForm);

const onSubmit = (formValue) => {
    console.log('form submitted ===> ', formValue)
};
<RxCustomForm onSubmit={onSubmit} onError={console.log} />
```

## LifeCycle

```jsx
const { rxForm } = require('./index');

class TransformForm extends React.Component {
    render() {
        return (
            <form>
                <input name="name" placeholder="uppercase value" />
            </form>
        )
    }
}

const RxTransformForm = rxForm({
    fields: {
        name: {
            beforeValidation: (value) => {
                console.log('before validation', value)
                return value.toUpperCase()
            },
            validation: (value) => {
                console.log('validation', value)
            },
            afterValidation: (value) => {
                console.log('afterValidation', value)
            }
        }
    }
})(TransformForm);

<RxTransformForm onSubmit={console.log} />
```

Dynamic Form

```jsx
const { rxForm } = require('./index');

class DynamicForm extends React.Component {
    componentDidUpdate({name}) {
        if (name.value === '' && this.props.name.value !== '') {
            this.props.addInputs(['isOk'])
        }
    }

    render() {
        return (
            <form>
                <input name="name" />
                { this.props.name.value !== '' &&
                    <input type="radio" name="isOk" value="fuck yeah" />
                }
               <button type="submit">Submit</button>
            </form>
        )
    }
}

const RxDynamicForm = rxForm({
    fields: {
        name: {},
        isOk: {}
    }
})(DynamicForm);

<RxDynamicForm onSubmit={console.log} />
```

Initial async value

```jsx
const { rxForm } = require('./index');
const { of } = require('rxjs');

class DynamicForm extends React.Component {
    render() {
        return (
            <form>
                <input name="dog" />
               <button type="submit">Submit</button>
            </form>
        )
    }
}

const RxDynamicForm = rxForm({
    fields: {
        dog: {},
    },
    value$: of({ dog: 'milou' })
})(DynamicForm);

<RxDynamicForm onSubmit={console.log} />
```

Initial async value

```jsx
const { rxForm } = require('./index');
const { of } = require('rxjs');

class DynamicForm extends React.Component {
    render() {
        return (
            <form>
                <input name="dog" />
               <button type="submit">Submit</button>
            </form>
        )
    }
}

const RxDynamicForm = rxForm({
    fields: {
        dog: {},
    },
    value$: (props) => of({ dog: props.dog })
})(DynamicForm);

<RxDynamicForm onSubmit={console.log} dog="pif" />
```
