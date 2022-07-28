import React, { useEffect, useState, Suspense, lazy, useCallback } from "react"
import { MetaTags } from "react-meta-tags"
import {
  Button,
  Card,
  Col,
  Container,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import profile from "assets/images/avatar-defult.jpg"
import UserDropdown from "rainComputing/components/chat/UserDropdown"
import classNames from "classnames"
import ChatboxSettingDropdown from "rainComputing/components/chat/ChatboxSettingDropdown"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import {
  getAllUsers,
  getCasesByUserId,
  getGroupsByUserIdandCaseId,
  getMessagesByUserIdandGroupId,
} from "rainComputing/helpers/backend_helper"
import { Link } from "react-router-dom"
import { isEmpty, map } from "lodash"
import DynamicModel from "rainComputing/components/modals/DynamicModal"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import DynamicSuspense from "rainComputing/components/loader/DynamicSuspense"
import { initialNewCaseValues } from "rainComputing/helpers/initialFormValues"
import { FakeCases } from "../FakeData"
import CaseGrid from "rainComputing/components/chat/CaseGrid"
import useAccordian from "rainComputing/helpers/hooks/useAccordian"
import SubgroupBar from "rainComputing/components/chat/SubgroupBar"
import { useChat } from "rainComputing/contextProviders/ChatProvider"
import moment from "moment"

const CreateCase = lazy(() =>
  import("rainComputing/components/chat/CreateCase")
)

//Chat left sidebar nav items
const sidebarNavItems = ["Chat", "Case", "Contact"]
//Chat subGroupColors
const subGroupColors = ["#0000ff", "#ffa500", "#ffc0cb", "#87ceeb"]

const ChatRc = () => {
  const { currentUser } = useUser()
  const {
    toggleOpen: newCaseModelOpen,
    setToggleOpen: setNewCaseModelOpen,
    toggleIt: toggleNewCaseModelOpen,
  } = useToggle(false)

  const {
    chats,
    setChats,
    currentRoom: currentChat,
    setCurrentRoom: setCurrentChat,
    getRoomsonEveryMessage,
    handleSendingMessage,
    messages,
    setMessages,
    messageStack,
  } = useChat()

  const { activeAccordian, handleSettingActiveAccordion } = useAccordian(-1)

  const [messageBox, setMessageBox] = useState(null)
  const [pageLoader, setPageLoader] = useState(true)
  const [activeTab, setactiveTab] = useState("1")
  const [contacts, setContacts] = useState([])
  const [newCase, setNewCase] = useState(initialNewCaseValues)
  const [allCases, setAllCases] = useState([])
  const [currentCase, setCurrentCase] = useState(null)
  const [allgroups, setAllgroups] = useState([])
  // const [currentChat, setCurrentChat] = useState(null)
  const [currentSubGroupIndex, setCurrentSubGroupIndex] = useState(0)
  const [receivers, setReceivers] = useState([])
  const [curMessage, setcurMessage] = useState("")

  //Toggle Active tab in chat-left-side
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  //Creating New ChatRoom
  const handleCreateChatRoom = async id => {
    console.log("Rendering handleCreateChatRoom", id)
  }

  //Getting all the cases
  const ongetAllCases = async () => {
    const allCasesRes = await getCasesByUserId({ userId: currentUser.userID })
    if (allCasesRes.success) {
      setAllCases(allCasesRes.cases)
      console.log("Rendering ongetAllCases res", allCasesRes)
    } else {
      setAllCases([])
      console.log("Rendering ongetAllCases error", allCasesRes)
    }
  }

  //Selecting current case
  const onSelectingCase = cas => {
    setCurrentCase(cas)
    setCurrentSubGroupIndex(0)
  }

  //Sending Message
  const handleSendMessage = async () => {
    if (curMessage) {
      const payLoad = {
        caseId: currentCase?._id,
        groupId: currentChat?._id,
        sender: currentUser?.userID,
        receivers,
        messageData: curMessage,
        isAttachement: false,
        attachments: [],
      }
      handleSendingMessage(payLoad)
      setcurMessage("")
    } else {
      console.log("You can't send empty message")
    }
  }

  //Detecting Enter key Press in textbox
  const onKeyPress = e => {
    const { key } = e
    if (key === "Enter") {
      console.log("Enter key Pressed")
    }
  }

  //Getting sender name
  const getMemberName = id => {
    const memberName = allCases
      .find(cas => cas._id === currentCase?._id)
      ?.caseMembers?.find(member => member?.id?._id === id)
    if (memberName)
      return memberName?.id?.firstname + " " + memberName?.id?.lastname
    return "Guest"
  }

  //Scrolling to bottom of message
  const scrollToBottom = () => {
    if (messageBox) {
      messageBox.scrollTop = messageBox.scrollHeight + 1000
    }
  }
  useEffect(() => {
    if (!isEmpty(messages)) scrollToBottom()
  }, [messages])

  //SideEffect for fetching Subgroups after case selected
  useEffect(() => {
    if (currentCase) {
      const onGettingSubgroups = async () => {
        const payLoad = {
          caseId: currentCase._id,
          userId: currentUser.userID,
        }
        const subGroupsRes = await getGroupsByUserIdandCaseId(payLoad)
        if (subGroupsRes.success) {
          setAllgroups(subGroupsRes.groups)
          setCurrentChat(subGroupsRes.groups[0])
        }
        // console.log("Rendering subGroupsRes   :", subGroupsRes)
      }
      onGettingSubgroups()
    }
  }, [currentCase])

  //SideEffect of setting receivers after currentchat changes
  useEffect(() => {
    if (currentChat) {
      setReceivers(
        currentChat.groupMembers
          .filter(m => m.id !== currentUser.userID)
          .map(r => r.id)
      )
      const onGettingGroupMessages = async () => {
        const payload = {
          groupId: currentChat?._id,
          userId: currentUser?.userID,
        }
        const res = await getMessagesByUserIdandGroupId(payload)
        if (res.success) {
          setMessages(res.groupMessages)
        } else {
          console.log("Failed to fetch Group message", res)
        }
      }

      onGettingGroupMessages()
    }
  }, [currentChat])

  useEffect(() => {
    // console.log("Rendering Fetching Contacts")
    const onGetContacts = async () => {
      const userRes = await getAllUsers({ userID: currentUser.userID })
      if (userRes.success) {
        setContacts(userRes.users)
      } else {
        setContacts([])
      }
    }
    onGetContacts()
    ongetAllCases()
    setPageLoader(false)
  }, [])

  return (
    <div className="page-content">
      <>
        {pageLoader ? (
          <>Loadinggg....</>
        ) : (
          <>
            {/* Model for creating case*/}
            <DynamicModel
              open={newCaseModelOpen}
              toggle={toggleNewCaseModelOpen}
              size="lg"
              modalTitle="New Case"
              footer={false}
            >
              <DynamicSuspense>
                <CreateCase
                  formValues={newCase}
                  setFormValues={setNewCase}
                  contacts={contacts}
                  setModalOpen={setNewCaseModelOpen}
                  getAllCases={ongetAllCases}
                />
              </DynamicSuspense>
            </DynamicModel>

            <MetaTags>
              <title>Chat RC</title>
            </MetaTags>
            <Container fluid>
              <Row>
                <Col xs="12" lg="5">
                  <div className="pb-2 border-bottom">
                    <div className="d-flex">
                      <div className="align-self-center me-3">
                        <img
                          src={profile}
                          className="avatar-sm rounded-circle"
                          alt=""
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-14 mt-0 mb-1">User One</h5>
                        <p className="text-muted mb-0">
                          <i className="mdi mdi-circle text-success align-middle me-1" />
                          Active
                        </p>
                      </div>
                      <UserDropdown />
                    </div>
                  </div>
                  <div className="my-1">
                    <Nav pills justified>
                      {sidebarNavItems.map((navItem, n) => (
                        <NavItem key={n}>
                          <NavLink
                            className={classNames({
                              active: activeTab === JSON.stringify(n + 1),
                            })}
                            onClick={() => {
                              toggleTab(JSON.stringify(n + 1))
                            }}
                          >
                            {navItem}
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                    <TabContent activeTab={activeTab} className="py-1">
                      <TabPane tabId="1">
                        <ul
                          className="list-unstyled chat-list"
                          id="recent-list"
                        >
                          <PerfectScrollbar style={{ height: "300px" }}>
                            {sidebarNavItems.map((i, j) => (
                              <p className="my-3" key={j}>
                                {i}
                              </p>
                            ))}
                          </PerfectScrollbar>
                        </ul>
                      </TabPane>
                      <TabPane tabId="2">
                        <div className="d-grid gap-2 my-2">
                          <button
                            type="button"
                            className="btn btn-info btn-rounded mb-2"
                            onClick={() => setNewCaseModelOpen(true)}
                          >
                            Create case
                            <i className="bx bx-pencil font-size-16 align-middle me-2 mx-2"></i>
                          </button>
                        </div>
                        <PerfectScrollbar style={{ height: "300px" }}>
                          <ul className="list-unstyled chat-list ">
                            {allCases.length > 0 &&
                              allCases.map((ca, j) => (
                                <CaseGrid
                                  caseData={ca}
                                  index={j}
                                  key={j}
                                  active={activeAccordian}
                                  onAccordionButtonClick={
                                    handleSettingActiveAccordion
                                  }
                                  handleSelectingCase={onSelectingCase}
                                  selected={currentCase?._id === ca?._id}
                                />
                              ))}
                          </ul>
                        </PerfectScrollbar>
                      </TabPane>
                      <TabPane tabId="3">
                        <div className="my-2">
                          <PerfectScrollbar style={{ height: "300px" }}>
                            {contacts &&
                              contacts.map((contact, i) => (
                                <ul key={i} className="list-unstyled chat-list">
                                  <li>
                                    <Link
                                      to="#"
                                      onClick={() => {
                                        handleCreateChatRoom(contact._id)
                                      }}
                                    >
                                      <div className="d-flex justify-content-between">
                                        <div className="align-self-center d-flex align-items-center me-3">
                                          <img
                                            src={profile}
                                            className="avatar-xs rounded-circle"
                                            alt=""
                                          />
                                          <h5 className="font-size-14 mb-0 ms-2">
                                            {contact.firstname}{" "}
                                            {contact.lastname}
                                          </h5>
                                        </div>

                                        <i className="font-size-24 bx bxl-messenger me-2" />
                                      </div>
                                    </Link>
                                  </li>
                                </ul>
                              ))}
                          </PerfectScrollbar>
                        </div>
                      </TabPane>
                    </TabContent>
                  </div>
                </Col>
                <Col xs="12" lg="7">
                  <div className="w-100 ">
                    <Card>
                      <div className="py-2 px-3 border-bottom">
                        <Row>
                          <Col md="4" xs="9">
                            <h5 className="font-size-15 mb-1">
                              {currentCase ? currentCase.caseName : "Demo Chat"}
                            </h5>
                            {currentChat && (
                              <span
                                style={{
                                  color:
                                    subGroupColors[
                                      currentSubGroupIndex %
                                        subGroupColors.length
                                    ],
                                }}
                              >
                                {currentChat?.groupName}
                              </span>
                            )}
                          </Col>
                          <Col md="8" xs="3">
                            <ul className="list-inline user-chat-nav text-end mb-0">
                              <li className="list-inline-item align-middle">
                                <ChatboxSettingDropdown />
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <div className="chat-conversation p-3">
                          <ul className="list-unstyled">
                            <PerfectScrollbar
                              style={{ height: "320px" }}
                              containerRef={ref => setMessageBox(ref)}
                            >
                              {messages &&
                                messages.map((msg, m) => (
                                  <li
                                    key={"test_k" + m}
                                    className={
                                      msg.sender === currentUser.userID
                                        ? "right"
                                        : ""
                                    }
                                  >
                                    <div className="conversation-list mw-75">
                                      {/* <UncontrolledDropdown>
                                        <DropdownToggle
                                          href="#"
                                          className="btn nav-btn"
                                          tag="i"
                                        >
                                          <i className="bx bx-dots-vertical-rounded" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          <DropdownItem href="#">
                                            Copy
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            Save
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            Forward
                                          </DropdownItem>
                                          <DropdownItem href="#">
                                            Delete
                                          </DropdownItem>
                                        </DropdownMenu>
                                      </UncontrolledDropdown> */}
                                      <div
                                        className="ctext-wrap "
                                        style={{
                                          backgroundColor:
                                            msg.sender == currentUser.userID &&
                                            subGroupColors[
                                              currentSubGroupIndex %
                                                subGroupColors.length
                                            ] + "33",
                                        }}
                                      >
                                        <div className="conversation-name">
                                          {getMemberName(msg.sender)}
                                        </div>
                                        <div className="mb-1">
                                          {msg.messageData}
                                        </div>
                                        <p className="chat-time mb-0">
                                          <i className="bx bx-comment-check align-middle me-1" />
                                          {/* <i className="bx bx-time-five align-middle me-1" /> */}
                                          {moment(msg.createdAt).format(
                                            "DD-MM-YY hh:mm"
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              {messageStack?.length > 0 &&
                                messageStack.map((msg, m) => (
                                  <li key={"test_k" + m} className="right">
                                    <div className="conversation-list">
                                      <div
                                        className="ctext-wrap "
                                        style={{
                                          backgroundColor:
                                            subGroupColors[
                                              currentSubGroupIndex %
                                                subGroupColors.length
                                            ] + "33",
                                        }}
                                      >
                                        <div className="conversation-name">
                                          {currentUser?.firstname +
                                            currentUser?.lastname}
                                        </div>
                                        <div className="mb-1">
                                          {msg.messageData}
                                        </div>
                                        <p className="chat-time mb-0">
                                          <i className="bx bx-loader bx-spin  align-middle me-1" />
                                          {moment(msg.createdAt).format(
                                            "DD-MM-YY hh:mm"
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </PerfectScrollbar>
                          </ul>
                        </div>
                        {currentChat?.isGroup && (
                          <SubgroupBar
                            groups={allgroups}
                            selectedGroup={currentChat}
                            setSelectedgroup={setCurrentChat}
                            subGroupColors={subGroupColors}
                            subGroupIndex={currentSubGroupIndex}
                            setSubGroupindex={setCurrentSubGroupIndex}
                          />
                        )}
                        <div className="p-2 chat-input-section">
                          <Row>
                            <Col>
                              <div className="position-relative">
                                <input
                                  type="text"
                                  value={curMessage}
                                  onKeyPress={onKeyPress}
                                  onChange={e => setcurMessage(e.target.value)}
                                  className="form-control chat-input"
                                  placeholder="Enter Message..."
                                />

                                <div className="chat-input-links">
                                  <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                      <div>
                                        <Input
                                          type="file"
                                          multiple={false}
                                          id="hidden-file"
                                          className="d-none"
                                          accept="image/*"
                                          // onChange={e => {
                                          //   upload(e)
                                          // }}
                                        />

                                        <Label
                                          htmlFor="hidden-file"
                                          style={{ margin: 0 }}
                                        >
                                          <i
                                            className="mdi mdi-file-image-outline "
                                            style={{
                                              color: "#556EE6",
                                              fontSize: 16,
                                            }}
                                          />
                                        </Label>
                                      </div>
                                    </li>
                                    <li className="list-inline-item"></li>
                                  </ul>
                                </div>
                              </div>
                            </Col>
                            <Col className="col-auto">
                              <Button
                                type="button"
                                color="primary"
                                onClick={() => handleSendMessage()}
                                className="btn btn-primary btn-rounded chat-send w-md "
                              >
                                <span className="d-none d-sm-inline-block me-2">
                                  Send
                                </span>
                                <i className="mdi mdi-send" />
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </>
    </div>
  )
}

export default ChatRc
