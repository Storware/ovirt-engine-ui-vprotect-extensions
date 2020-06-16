import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectPolicies} from '../../../../../store/virtual-machine/selectors'
import {Button} from 'primereact/button';
import {Link} from 'react-router-dom'
import {Field, Form, Formik} from 'formik';
import Text from '../../../compoenents/input/reactive/Text';
import Toggle from '../../../compoenents/input/reactive/Toggle';
import Select from '../../../compoenents/input/reactive/Select';
import {useParams} from 'react-router-dom'
import {selectSchedule} from '../../../../../store/schedule/selectors';
import {getSchedulePage, save, setScheduleAction} from '../../../../../store/schedule/actions';
import {schedulesService} from '../../../services/schedules-service'
import Convert from '../../../compoenents/input/reactive/Convert';
import Time from '../../../compoenents/input/reactive/Time';
import {Interval} from '../../../model/Interval'
import Days from '../../../compoenents/input/reactive/Days';
import InputListBox from '../../../compoenents/input/reactive/InputListBox';
import {dayOfWeekOccurrences, months} from '../../../model/Occurrences'
import SchedulePolicies from '../../../compoenents/input/reactive/SchedulePolicies';
import {Panel} from 'primereact/panel';

const SnapshotSchedule = () => {
    let dispatch = useDispatch()
    let {guid} = useParams()

    let model = useSelector(selectSchedule)
    let policies = useSelector(selectPolicies)

    useEffect(() => {
        dispatch(getSchedulePage('SNAPSHOT', guid))
    }, [guid])

    const onExecutionTypeChange = (e) => {
        const fullExecutionType = e.value.name === 'TIME'
        dispatch(setScheduleAction({
            ...model,
            executionType: e.value,
            hour: fullExecutionType ? 36000000 : null,
            startWindowLength: fullExecutionType ? 21600000 : null,
            interval: fullExecutionType ? null : new Interval(),
        }))
    }

    return (
        <Panel className='form' header='Schedule'>
            <Formik
                enableReinitialize
                initialValues={model}
                onSubmit={(values, {setSubmitting}) => {
                    save(values);
                    setSubmitting(false)
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Field name='name' component={Text} label='Name'/>
                        <Field name='active' component={Toggle} label='Active'/>
                        <Field name='backupType'
                               component={Select}
                               label='Backup type'
                               optionLabel='description'
                               dataKey='name'
                               options={schedulesService.backupTypes}/>
                        <Field name='executionType'
                               component={Select}
                               label='Schedule execution type'
                               optionLabel='description'
                               change={onExecutionTypeChange}
                               dataKey='name'
                               options={schedulesService.executionTypes}/>
                        {!model.interval &&
                        <div>
                          <Field name='startWindowLength'
                                 component={Convert}
                                 label='Start Window Length [min]'
                                 factor={1000 * 60}/>
                          <Field name='hour'
                                 component={Time}
                                 label='Choose time of day for backup'/>
                        </div>
                        }
                        {model.interval &&
                        <div>
                          <Field name='interval.frequency'
                                 component={Convert}
                                 label='Frequency [min]'
                                 factor={1000 * 60}/>
                          <Field name='interval.startHour'
                                 component={Time}
                                 label='Choose time of interval start'/>
                          <Field name='interval.endHour'
                                 component={Time}
                                 label='Choose time of interval end'/>
                        </div>
                        }

                        <div className='row'>
                            <div className='col'>
                                <Field name='daysOfWeek'
                                       component={Days}
                                       hour={model.hour}
                                       label='Choose days (required)'/>
                            </div>
                            <div className='col'>
                                <Field name='dayOfWeekOccurrences'
                                       component={InputListBox}
                                       label='Selected day of week occurrence (optional)'
                                       multiple
                                       optionLabel='name'
                                       options={dayOfWeekOccurrences}
                                       dataKey='name'/>
                            </div>
                            <div className='col'>
                                <Field name='months'
                                       component={InputListBox}
                                       label='Selected months (optional)'
                                       multiple
                                       optionLabel='name'
                                       options={months}
                                       dataKey='name'/>
                            </div>
                        </div>

                        <Field name='rules'
                               component={SchedulePolicies}
                               label='Choose Virtual Environment policies'
                               options={policies}/>

                        <div className='d-flex justify-content-between mt-3'>
                            <div>
                                <Link to={`/schedules/list/SNAPSHOT`}>
                                    <Button label='Back'/>
                                </Link>
                            </div>
                            <div>
                                <Button type='submit' label='Save' className='p-button-success' disabled={isSubmitting}/>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>


        </Panel>
    )
}

export default SnapshotSchedule
