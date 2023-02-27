import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
// import PropTypes from "prop-types"
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  NavItem,
  NavLink,
  Row,
  FormFeedback,
  Button,
} from "reactstrap"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { regAttorneyDetails } from "rainComputing/helpers/backend_helper"

const AttorneyDetailsCard = () => {
  const { currentUser, setCurrentUser } = useUser()
  const [attorneyDetail, setAttorneyDetail] = useState({})
  const { currentAttorney } = useUser()
  const [loading, setLoading] = useState(false)

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      attorneybarnumber: attorneyDetail?.registerNumber,
      phonenumber: attorneyDetail?.phoneNumber,
      email: currentUser.email,
      firm: attorneyDetail?.firm,
      bio: attorneyDetail?.bio,
      address: attorneyDetail?.address,
      country: attorneyDetail?.country,
      state: attorneyDetail?.state,
      city: attorneyDetail?.city,
      postalCode: attorneyDetail?.postalCode,
    },
    validationSchema: Yup.object({
      attorneybarnumber: Yup.string().required(
        "Please Enter Your Attorney BarNumber"
      ),
      phonenumber: Yup.string().required("Please Enter Your Phone Number"),
    }),
    onSubmit: values => {
      handleAttorneyReg({
        // barNumber: values.attorneybarnumber,
        // phoneNumber: values.phonenumber,
        // address: values.address,
        // userID: currentUser.userID,
        // status: "requested",
      })
    },
  })

  useEffect(() => {
    if (currentAttorney) {
      const payload = { id: currentAttorney._id }
      const getAttorneyinfo = async () => {
        const res = await regAttorneyDetails(payload)
        const { attorney } = res
        if (attorney) {
          setAttorneyDetail(attorney)
        }
      }
      getAttorneyinfo()
    }
  }, [currentAttorney])

  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>RainComputing | Rain - Admin & Dashboard Template</title>
        </MetaTags>

        <Container fluid={true}>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                    }}
                  >
                    <div className="wizard clearfix">
                      <div className="steps clearfix">
                        <ul>
                          <NavItem>
                            <NavLink>
                              <h4 className="d-flex justify-content-center card-title mt-2">
                                {" "}
                                My info
                              </h4>{" "}
                            </NavLink>
                          </NavItem>
                        </ul>
                      </div>
                      <div className="content clearfix mt-4">
                        <Form>
                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom01">
                                  Attorney BarNumber
                                </Label>

                                <Input
                                  name="attorneybarnumber"
                                  type="text"
                                  readOnly
                                  className="form-control"
                                  id="validationCustom01"
                                  placeholder="Enter Your Attorney BarNumber"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={
                                    validation.values.attorneybarnumber || ""
                                  }
                                  invalid={
                                    validation.touched.attorneybarnumber &&
                                    validation.errors.attorneybarnumber
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.attorneybarnumber &&
                                validation.errors.attorneybarnumber ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.attorneybarnumber}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom03">
                                  Phone Number
                                </Label>
                                <Input
                                  type="text"
                                  name="phonenumber"
                                  className="form-control"
                                  id="validationCustom03"
                                  placeholder="Enter Your Phone Number"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.phonenumber || ""}
                                  invalid={
                                    validation.touched.phonenumber &&
                                    validation.errors.phonenumber
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.phonenumber &&
                                validation.errors.phonenumber ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.phonenumber}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                          <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom04">Firm</Label>
                                <Input
                                  type="text"
                                  name="firm"
                                  readOnly
                                  className="form-control"
                                  id="validationCustom04"
                                  placeholder="Enter Your Email ID"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.firm || ""}
                                  invalid={
                                    validation.touched.firm &&
                                    validation.errors.firm
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.firm &&
                                validation.errors.firm ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.firm}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom04">
                                  Address
                                </Label>
                                <Input
                                  type="text"
                                  name="address"
                                  readOnly
                                  className="form-control"
                                  id="validationCustom04"
                                  placeholder="Enter Your address"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.address || ""}
                                  invalid={
                                    validation.touched.address &&
                                    validation.errors.address
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.address &&
                                validation.errors.address ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.address}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>

                          
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom04">
                                  Country
                                </Label>
                                <Input
                                  type="text"
                                  name="country"
                                  readOnly
                                  className="form-control"
                                  id="validationCustom04"
                                  placeholder="Enter Your Email ID"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.country || ""}
                                  invalid={
                                    validation.touched.country &&
                                    validation.errors.country
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.country &&
                                validation.errors.country ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.country}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom04">
                                  State
                                </Label>
                                <Input
                                  type="text"
                                  name="state"
                                  readOnly
                                  className="form-control"
                                  id="validationCustom04"
                                  placeholder="Enter Your Email ID"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.state || ""}
                                  invalid={
                                    validation.touched.state &&
                                    validation.errors.state
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.state &&
                                validation.errors.state ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.state}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom04">City</Label>
                                <Input
                                  type="text"
                                  name="city"
                                  readOnly
                                  className="form-control"
                                  id="validationCustom04"
                                  placeholder="Enter Your Email ID"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.city || ""}
                                  invalid={
                                    validation.touched.city &&
                                    validation.errors.city
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.city &&
                                validation.errors.city ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.city}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom04">
                                  PostalCode
                                </Label>
                                <Input
                                  type="text"
                                  name="postalCode"
                                  readOnly
                                  className="form-control"
                                  id="validationCustom04"
                                  placeholder="Enter Your Email ID"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.postalCode || ""}
                                  invalid={
                                    validation.touched.postalCode &&
                                    validation.errors.postalCode
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.postalCode &&
                                validation.errors.postalCode ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.postalCode}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="12">
                              <FormGroup className="mb-3">
                                <Label htmlFor="validationCustom04">Bio</Label>
                                <textarea
                                  type="text"
                                  name="bio"
                                  readOnly
                                  className="form-control"
                                  id="validationCustom04"
                                  placeholder="Enter Your Email ID"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.bio || ""}
                                  invalid={
                                    validation.touched.bio &&
                                    validation.errors.bio
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.bio &&
                                validation.errors.bio ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.bio}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>
                        {/* <Button color="primary" type="submit">
                          SUBMIT
                        </Button> */}
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}
// AttorneyDetails.propTypes = {
//   currentAttorney: PropTypes.object,
// }
export default AttorneyDetailsCard
