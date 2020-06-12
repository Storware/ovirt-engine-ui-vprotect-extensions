import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectPolicies, selectSnapshotPolicies, selectVirtualMachine} from '../../../../../store/virtual-machine/selectors'
import {Accordion, AccordionTab} from 'primereact/accordion';
import {Dropdown} from 'primereact/dropdown';
import {policiesService} from '../../../services/policies-service';
import {alertService} from '../../../services/alert-service';
import {virtualMachinesService, preAndPostSnapStdErrorHandlingOptions} from '../../../services/virtual-machines-service';
import {ToggleButton} from 'primereact/togglebutton';
import {InputText} from 'primereact/inputtext';
import {Chips} from 'primereact/chips';
import {Button} from 'primereact/button';
import {Link} from 'react-router-dom'
import {ErrorMessage, Field, Form, Formik} from 'formik';
import Text from '../../../compoenents/input/reactive/Text';
import {PolicySnapshot} from '../../../model/policies/policy-snapshot';
import Toggle from '../../../compoenents/input/reactive/Toggle';
import {ListBox} from 'primereact/listbox';
import Select from '../../../compoenents/input/reactive/Select';
import InputSlider from '../../../compoenents/input/reactive/InputSlider';
import InputChips from '../../../compoenents/input/reactive/InputChips';
import {
    selectBackupDestinations,
    selectHypervisorClusters, selectPolicy,
    selectSchedules,
    selectVirtualMachines
} from '../../../../../store/policy/selectors';
import {getPolicyPage} from '../../../../../store/policy/actions';
import {useParams} from 'react-router-dom'
import InputListBox from '../../../compoenents/input/reactive/InputListBox';

const SnapshotPolicy = () => {
    let dispatch = useDispatch()
    let {guid} = useParams()

    let model = guid === 'create' ? new PolicySnapshot() : useSelector(selectPolicy)
    let hypervisorClusters = useSelector(selectHypervisorClusters)
    let virtualMachines = useSelector(selectVirtualMachines)
    let backupDestinations = useSelector(selectBackupDestinations)
    let schedules = useSelector(selectSchedules)

    useEffect(() => {
        dispatch(getPolicyPage('snapshot', guid))
    }, [guid])

    let activeIndex;
    let setActiveIndex;
    [activeIndex, setActiveIndex] = useState({
        first: [0],
        second: []
    });

    const save = async (model) => {
        if (model.guid) {
            await policiesService.updatePolicy('snapshot', model.guid, model)
            await policiesService.updateRule('snapshot', model.rules[0].guid, model.rules[0])
            alertService.info('Policy updated')
        } else {
            const policy = await policiesService.createPolicy('snapshot', model)
            await policiesService.createRule('snapshot', {
                ...model.rules[0],
                name: 'Default',
                policy: {
                    guid: policy.guid
                }
            })
            alertService.info('Policy created')
        }
    }

    return (
        <div className='form'>
            <Formik
                enableReinitialize
                initialValues={model}
                onSubmit={(values, { setSubmitting }) => {
                    save(values);
                    setSubmitting(false)
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Accordion multiple activeIndex={activeIndex.first}
                                   onTabChange={(e) => setActiveIndex({
                                       ...activeIndex,
                                       first: e.index
                                   })}>
                            <AccordionTab header='General'>
                                <Field name="name" component={Text} label='Name'/>
                                <Field name="autoRemoveNonPresent" component={Toggle} label='Auto remove non-present Virtual Environments'/>
                                <Field name="priority" component={InputSlider} label='Priority'/>
                            </AccordionTab>
                            <AccordionTab header='Auto-assigment'>
                                <Field name="autoAssignSettings.mode"
                                       options={policiesService.assignModes}
                                       component={Select}
                                       optionLabel='description'
                                       dataKey='name'
                                       required
                                       label='Auto-assign Mode'/>

                                <h3>Include rules</h3>
                                <div className={'row'}>
                                    <div className={'col'}>
                                        <Field name="autoAssignSettings.includeTags"
                                           component={InputChips}
                                           label='Include TAG based rules'/>
                                    </div>
                                    <div className={'col'}>
                                        <Field name="autoAssignSettings.includeRegExps"
                                               component={InputChips}
                                               label='Include Regex based rules'/>
                                    </div>
                                </div>

                                <h3>Exclude rules</h3>
                                <div className={'row'}>
                                    <div className={'col'}>
                                        <Field name="autoAssignSettings.excludeTags"
                                               component={InputChips}
                                               label='Exclude TAG based rules'/>
                                    </div>
                                    <div className={'col'}>
                                        <Field name="autoAssignSettings.excludeRegExps"
                                               component={InputChips}
                                               label='Exclude Regex based rules'/>
                                    </div>
                                </div>

                                <Field name="autoAssignSettings.hvClusters"
                                       options={hypervisorClusters}
                                       component={InputListBox}
                                       optionLabel='name'
                                       multiple
                                       dataKey='guid'
                                       label='Auto-assign Virtual Environments only if they belong to the following clusters (optional)'/>
                            </AccordionTab>

                            <AccordionTab header='Virtual Environments'>
                                <Field name="vms"
                                       options={virtualMachines}
                                       component={InputListBox}
                                       optionLabel='name'
                                       multiple
                                       dataKey='guid'
                                       label='Choose Virtual Environments'/>
                            </AccordionTab>

                            <AccordionTab header='Rule'>
                                <Field name="rules[0].retentionVersions" component={Text} label='Retention versions'/>
                                <Field name="rules[0].retentionDays" component={Text} label='Retention days'/>

                                <Field name="rules[0].schedules"
                                       options={schedules}
                                       component={InputListBox}
                                       optionLabel='name'
                                       multiple
                                       dataKey='guid'
                                       label='Choose schedules'/>
                            </AccordionTab>
                        </Accordion>

                        <div className='d-flex justify-content-between mt-3'>
                            <div>
                                <Link to={`/policies/list/snapshot`}>
                                    <Button label='Back' />
                                </Link>
                            </div>
                            <div>
                                <Button type="submit" label='Save' className='p-button-success' disabled={isSubmitting} />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>


        </div>
    )
}

export default SnapshotPolicy
