import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectPolicies} from '../../../../../store/virtual-machine/selectors'
import {Accordion, AccordionTab} from 'primereact/accordion';
import {policiesService} from '../../../services/policies-service';
import {Button} from 'primereact/button';
import {Link} from 'react-router-dom'
import {Field, Form, Formik} from 'formik';
import Text from '../../../compoenents/input/reactive/Text';
import Toggle from '../../../compoenents/input/reactive/Toggle';
import Select from '../../../compoenents/input/reactive/Select';
import InputSlider from '../../../compoenents/input/reactive/InputSlider';
import InputChips from '../../../compoenents/input/reactive/InputChips';
import {useParams} from 'react-router-dom'
import InputListBox from '../../../compoenents/input/reactive/InputListBox';
import {selectSchedule} from '../../../../../store/schedule/selectors';
import {getSchedulePage, save} from '../../../../../store/schedule/actions';
import {Schedule} from '../../../model/schedule';
import {Dropdown} from 'primereact/dropdown';
import {schedulesService} from '../../../services/schedules-service'
import Convert from '../../../compoenents/input/reactive/Convert';

const SnapshotSchedule = () => {
    let dispatch = useDispatch()
    let {guid} = useParams()

    let model = guid === 'create' ? new Schedule() : useSelector(selectSchedule)
    let policies = useSelector(selectPolicies)

    useEffect(() => {
        dispatch(getSchedulePage('SNAPSHOT', guid))
    }, [guid])

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

                        <Field name="name" component={Text} label='Name'/>
                        <Field name="active" component={Toggle} label='Active'/>
                        <Field name="backupType"
                               component={Select}
                               label='Priority'
                               optionLabel='description'
                               dataKey='name'
                               options={schedulesService.backupTypes}/>
                           <Field name="executionType"
                               component={Select}
                               label='Schedule execution type'
                               optionLabel='description'
                               dataKey='name'
                               options={schedulesService.executionTypes}/>
                        {!model.interval &&
                            <div>
                              <Field name="startWindowLength"
                                     component={Convert}
                                     label='Start Window Length [min]'
                                     factor={1000 * 60}/>
                              <Field name="hour"
                                     component={Convert}
                                     label='Start Window Length [min]'
                                     factor={1000 * 60}/>
                            </div>
                        }



                        <div className='d-flex justify-content-between mt-3'>
                            <div>
                                <Link to={`/schedules/list/snapshot`}>
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

export default SnapshotSchedule
