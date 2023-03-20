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

const GroupReminder = ({groupReminder,setGoupReminder}) => {
  const [reminderReceived, setReminderReceived] = useState(false);
  
  const { currentUser } = useUser()
  const [highlightedReminder, setHighlightedReminder] = useState(null);
  const [removeData, setRemoveData] = useState()
  const {
    toggleOpen: groupReminderDeleteModalOpen,
    setToggleOpen: setReminderDeleteModalOpen,
    toggleIt: togglegroupReminderDeleteModal,
  } = useToggle(false)
  // useEffect(() => {
  //   const getReminderData = async () => {
  //     if (currentUser) {
  //       const res = await getReminder({ currentUserID: currentUser?.userID });
  //       if (res.success) {
  //         const reminders = res?.reminders.filter((reminder) => {
  //           return reminder.selectedMembers.some(
  //             (member) => member.id === currentUser?.userID
  //           );
  //         });
  //         // Schedule the reminders
  //         reminders.forEach((reminder) => {
  //           const scheduledTime = reminder?.scheduledTime;
  //           const notificationTime = moment(scheduledTime, moment.ISO_8601)
  //             .subtract(5, "hours")
  //             .subtract(30, "minutes")
  //             .toDate();
  //           console.log(
  //             `Scheduling reminder for ${reminder.title} at ${notificationTime}`
  //           );
  
  //           // Schedule the notification to show when the notification time is reached
  //           const now = new Date().getTime();
  //           const timeDiff = notificationTime.getTime() - now;
  //           if (timeDiff > 0) {
  //             // Set a timeout for the notification to be received
  //             setTimeout(() => {
  //               setGoupReminder((prevState) => [...prevState, reminder]);
  //               setReminderReceived(true);
  //               // Display the notification here
  //               toastr.success(
  //                 `You have ${reminder.title} successfully`,
  //                 "Success"
  //               );
  //               // console.log(`Showing notification for ${reminder.title}`)
  //             }, timeDiff);
  //           } else {
  //             // If the time for the notification has already passed, set the reminder as received
  //             setGoupReminder((prevState) => [...prevState, reminder]);
  //           }
  //         });
  //       }
  //     }
  //   };
  //   getReminderData();
  //   const interval = setInterval(() => {
  //     getReminderData();
  //   }, 60 * 1000); // Call the function every minute
  
  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, [currentUser])

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
  const now = new Date();
const upcomingTimeRange = 15 * 60 * 1000; // 15 minutes in milliseconds
const firstreminder = groupReminder[0]
 console.log("groupRemind", firstreminder)


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
   
{groupReminder?.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime)).map((groupRemind, k) => (
  
  <div key={k}  >      
       
              <Card>
                <CardBody>
                {k === 0 ? <i className="fa fa-bell icon "></i> : null}
                  <button
                    type="button"
                    className="close" 
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ width: "20px" }}
                    onClick={() => handleDelete(groupRemind)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <CardTitle className="mt-0">
                    Title :{groupRemind?.title}
                  </CardTitle>
                  <CardText>
                    {" "}
                    Message Data :{groupRemind?.messageId?.messageData}
                  </CardText>
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
