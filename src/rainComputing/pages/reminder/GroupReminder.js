import React, { useEffect, useState } from "react"
import { Card, CardBody, CardText, CardTitle, Modal } from "reactstrap"
import {
  getReminder,
  removeReminder,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import toastr from "toastr"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import DeleteModal from "components/Common/DeleteModal"
import moment from "moment"
import PropTypes from "prop-types"
import "./reminder.css"

const GroupReminder = ({ groupReminder, setGoupReminder }) => {
  const [reminderReceived, setReminderReceived] = useState(false)

  const { currentUser } = useUser()
  const [highlightedReminder, setHighlightedReminder] = useState(null)
  const [removeData, setRemoveData] = useState()
  const {
    toggleOpen: groupReminderDeleteModalOpen,
    setToggleOpen: setReminderDeleteModalOpen,
    toggleIt: togglegroupReminderDeleteModal,
  } = useToggle(false)

  const handleRemove = async () => {
    const payload = {
      reminderId: removeData?._id,
    }
    const res = await removeReminder(payload)
    if (res.success) {
      toastr.success(`You have reminder remove  successfully`, "Success")
      setGoupReminder(prevState =>
        prevState.filter(reminder => reminder._id !== removeData._id)
      )
      setReminderDeleteModalOpen(false)
    }
  }
  const handleDelete = groupRemind => {
    setRemoveData(groupRemind)
    setReminderDeleteModalOpen(true)
  }
  const now = new Date()
  const upcomingTimeRange = 15 * 60 * 1000 // 15 minutes in milliseconds

  return (
    <div className="modal-body">
      <DeleteModal
        show={groupReminderDeleteModalOpen}
        onDeleteClick={handleRemove}
        confirmText="Yes,Remove"
        cancelText="Cancel"
        onCloseClick={togglegroupReminderDeleteModal}
      />

      {groupReminder?.length > 0 ? (
        <>
          {" "}
          {groupReminder
            ?.sort(
              (a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime)
            )
            .map((groupRemind, k) => (
              <div key={k}>
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-end px-4">
                      {k === 0 ? <i className="fa fa-bell icon "></i> : null}
                      <button
                        type="button"
                        className="close py-4"
                        data-dismiss="modal"
                        aria-label="Close"
                        style={{ width: "20px" }}
                        onClick={() => handleDelete(groupRemind)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <CardTitle className="mt-0">
                      Title :{groupRemind?.title}
                    </CardTitle>

                    {groupRemind?.messageId?.messageData && (
                      <CardText>
                        {" "}
                        Message Data :{groupRemind?.messageId?.messageData}
                      </CardText>
                    )}
                    <CardText className="text-primary">
                      {" "}
                      Date & Time:{groupRemind?.scheduledTime}
                    </CardText>
                    {/* <CardText className="text-primary">
                    {" "}
                    Time :{groupRemind?.time}
                  </CardText>{" "} */}
                  </CardBody>
                </Card>
              </div>
            ))}
        </>
      ) : (
        <p>No Reminders</p>
      )}
    </div>
  )
}

GroupReminder.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
  setOpen: PropTypes.func,
  show: PropTypes.fun,
  groupReminder: PropTypes.any,
  setGoupReminder: PropTypes.any,
}
export default GroupReminder
