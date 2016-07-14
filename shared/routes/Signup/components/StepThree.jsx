import React, { Component, PropTypes } from 'react';
import { Textfield, Button, Spinner } from 'react-mdl';

class StepThree extends Component {
  static propTypes = {
    onCallbackParent: PropTypes.func,
    onSignup: PropTypes.func,
    fieldValues: PropTypes.object,
    next: PropTypes.number,
    previous: PropTypes.number,
    index: PropTypes.number,
    isWaiting: PropTypes.func,
  };

  onFieldChanged = evt => this.setState({ [evt.target.name]: evt.target.value });

  render() {
    return (
      <form
        className="Signup__container--step"
        onSubmit={this.props.onCallbackParent(this.state, this.props.onSignup(this.props.next))}
      >
        <div className="Signup__container--body-fieldrow">
          <Textfield
            label="Full name"
            onChange={this.onFieldChanged}
            floatingLabel
            defaultValue={this.props.fieldValues.fullName}
            name="fullName"
            pattern="^[a-zA-Z ]{2,30}$"
            error="invalid input"
            className="input-ctrl"
            required
          />
        </div>
        <div className="Signup__container--body-fieldrow">
          <Textfield
            label="Address line 1"
            onChange={this.onFieldChanged}
            floatingLabel
            defaultValue={this.props.fieldValues.addressLine1}
            name="addressLine1"
            pattern="^[a-zA-Z\s\d\/]*\d[a-zA-Z\s\d\/]*$"
            error="address does not look good"
            className="input-ctrl"
            required
          />
        </div>
        <div className="Signup__container--body-fieldrow">
          <Textfield
            label="Address line 2"
            onChange={this.onFieldChanged}
            floatingLabel
            defaultValue={this.props.fieldValues.addressLine2}
            name="addressLine2"
            className="input-ctrl"
          />
        </div>
        <div className="Signup__container--body-fieldrow doubly">
          <Textfield
            label="Postal Code"
            floatingLabel
            name="postCode"
            onChange={this.onFieldChanged}
            defaultValue={this.props.fieldValues.postCode}
            required
          />
          <Textfield
            label="Country"
            onChange={this.onFieldChanged}
            floatingLabel
            defaultValue={this.props.fieldValues.country}
            name="country"
            className="input-ctrl"
            required
          />
        </div>
        <div className="Signup__container--body-fieldrow">
          <Textfield
            label="State"
            onChange={this.onFieldChanged}
            floatingLabel
            defaultValue={this.props.fieldValues.state}
            name="state"
            className="input-ctrl"
          />
        </div>
        <div className="Signup__container--body-fieldrow doubly">
          <Textfield
            label="City"
            onChange={this.onFieldChanged}
            floatingLabel
            defaultValue={this.props.fieldValues.city}
            name="city"
            className="input-ctrl"
            required
          />
          <Textfield
            label="Phone"
            onChange={this.onFieldChanged}
            floatingLabel
            defaultValue={this.props.fieldValues.phone}
            name="phone"
            className="input-ctrl"
            required
            pattern="^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$"
            error="invalid phone number format"
          />
        </div>
        <div className="Signup__container--body-fieldrow actions">
          {
            (this.props.index !== 0) &&
              <Button raised onClick={this.props.previous}>Prev</Button>
          }
          <Button
            raised
            primary
            type="submit"
            className="Signup__container--body-fieldrow_submit"
          >
            Submit
          </Button>
          <Spinner style={{ display: this.props.isWaiting ? 'block' : 'none' }} />
        </div>
      </form>
    );
  }
}

export default React.createFactory(StepThree);
