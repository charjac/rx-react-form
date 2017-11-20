import * as React from 'react'
import autobind from 'autobind-decorator'

import { WizardParams, WizardProps, WizardState, FormValues, RequiredProps } from '../../types'

export const wizard = function<Props extends RequiredProps>({ initialStep = 0, steps }: WizardParams) {
  return (Comp: React.ComponentClass<Props & WizardProps> | React.StatelessComponent<Props & WizardProps>) => {
    class RxWizardForm extends React.Component<Props, WizardState> {
      static displayName = `RxWizardForm(${Comp.displayName || Comp.name})`

      state = {
        currentStep: initialStep,
        formValue: {},
        submitted: false,
      }

      get stepsSize() {
        return steps.length - 1
      }

      @autobind
      goTo(step: number): void {
        this.setState({
          currentStep: step,
        })
      }

      @autobind
      handleSubmit(formValue: FormValues): void {
        const submitted = this.state.currentStep === this.stepsSize
        const currentStep = submitted ? this.state.currentStep : this.state.currentStep + 1

        this.setState(
          {
            currentStep,
            formValue: {
              ...this.state.formValue,
              ...formValue,
            },
            submitted,
          },
          () => {
            if (submitted) {
              this.props.onSubmit(this.state.formValue)
            }
          },
        )
      }

      @autobind
      renderCurrentForm(): JSX.Element {
        const { currentStep } = this.state
        const FormComponent = steps[currentStep]
        return <FormComponent onSubmit={this.handleSubmit} onError={this.props.onError} />
      }

      render(): JSX.Element {
        return <Comp goTo={this.goTo} renderCurrentForm={this.renderCurrentForm} {...this.state} {...this.props} />
      }
    }

    return RxWizardForm
  }
}