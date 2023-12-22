const { RuleTester } = require('eslint');
const noFormcontrolObjectWithoutDisabledRule = require('./no-formcontrol-object-without-disabled');

const ruleTester = new RuleTester();

ruleTester.run('no-formcontrol-object-without-disabled', noFormcontrolObjectWithoutDisabledRule, {
    valid: [{
        code: `
            this.formBuilder.group({ firstName: [{value: "John", disabled: true }] });
        `,
    }],
    invalid: [{
        code: `
            this.formGroup = ReactiveFormsHelper.augmentParentFormGroup(this.parentFormGroup.form, {
                workTelephoneNumber: [{ value: employee.workTelephoneNumber },
                    [
                    this.validationUtils.domain(this.employeeFieldPatternService).getPatternValidator('contactNumber')
                    ]
                ],
                employee: this.formBuilder.group({
                    mobileNumber: [{ value: employee.mobileNumber },
                    [
                        this.validationUtils.domain(this.employeeFieldPatternService).getPatternValidator('contactNumber')
                    ]
                    ],
                    facsimileNumber: [{ value: employee.facsimileNumber, disabled: employee.isTerminated },
                    [
                        this.validationUtils.domain(this.employeeFieldPatternService).getPatternValidator('contactNumber')
                    ]
                    ],
                    homeTelephoneNumber: [{ value: employee.homeTelephoneNumber, disabled: employee.isTerminated },
                    [
                        this.validationUtils.domain(this.employeeFieldPatternService).getPatternValidator('contactNumber')
                    ]
                    ],
                    emailAddress: [{ value: employee.emailAddress, disabled: employee.isTerminated || this.disableContactEmailField },
                    [
                        EmailValidator(),
                        EmployeeEmailExistsValidator(this.employeeService, this.configurationService, employee.businessId, employee.id),
                        Validators.required
                    ]
                    ],
                })
            });
        `,
        // we can use messageId from the rule object
        errors: [{ messageId: 'incompleteInitObject' }, { messageId: 'incompleteInitObject' }],
    }]
});
