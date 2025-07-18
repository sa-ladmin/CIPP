import { Alert, Stack, Typography, Card, CardContent, CardHeader, Divider } from "@mui/material";
import CippWizardStepButtons from "./CippWizardStepButtons";
import CippFormComponent from "../CippComponents/CippFormComponent";
import { CippFormCondition } from "../CippComponents/CippFormCondition";
import { useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { Grid } from "@mui/system";
import { useSettings } from "../../hooks/use-settings";

export const CippWizardOffboarding = (props) => {
  const { postUrl, formControl, onPreviousStep, onNextStep, currentStep } = props;
  const currentTenant = formControl.watch("tenantFilter");
  const selectedUsers = useWatch({ control: formControl.control, name: "user" });
  const [showAlert, setShowAlert] = useState(false);
  const userSettingsDefaults = useSettings().userSettingsDefaults;
  const disableForwarding = useWatch({ control: formControl.control, name: "disableForwarding" });

  useEffect(() => {
    if (selectedUsers.length >= 3) {
      setShowAlert(true);
      formControl.setValue("Scheduled.enabled", true);
    }
  }, [selectedUsers]);

  useEffect(() => {
    if (userSettingsDefaults?.offboardingDefaults) {
      userSettingsDefaults.offboardingDefaults.forEach((setting) => {
        formControl.setValue(setting.name, setting.value);
      });
    }
  }, [userSettingsDefaults]);

  useEffect(() => {
    if (disableForwarding) {
      formControl.setValue("forward", null);
      formControl.setValue("KeepCopy", false);
    }
  }, [disableForwarding, formControl]);

  return (
    <Stack spacing={4}>
      <Grid container spacing={4}>
        <Grid size={6}>
          <Card variant="outlined">
            <CardHeader title="Offboarding Settings" />
            <Divider />
            <CardContent>
              <CippFormComponent
                name="ConvertToShared"
                label="Convert to Shared Mailbox"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="HideFromGAL"
                label="Hide from Global Address List"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="removeCalendarInvites"
                label="Cancel all calendar invites"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="removePermissions"
                label="Remove user's mailbox permissions"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="RemoveRules"
                label="Remove all Rules"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="RemoveMobile"
                label="Remove all Mobile Devices"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="RemoveGroups"
                label="Remove from all groups"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="RemoveLicenses"
                label="Remove Licenses"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="RevokeSessions"
                label="Revoke all sessions"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="DisableSignIn"
                label="Disable Sign in"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="ClearImmutableId"
                label="Clear Immutable ID"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="ResetPass"
                label="Reset Password"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="RemoveMFADevices"
                label="Remove all MFA Devices"
                type="switch"
                formControl={formControl}
              />
              <CippFormComponent
                name="DeleteUser"
                label="Delete user"
                type="switch"
                formControl={formControl}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={6}>
          <Card variant="outlined">
            <CardHeader title="Permissions and forwarding" />
            <Divider />
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Mailbox Access
              </Typography>
              <CippFormComponent
                sx={{ m: 1 }}
                name="AccessNoAutomap"
                label="Grant Full Access (no automap)"
                type="autoComplete"
                placeholder="Leave blank if not needed"
                formControl={formControl}
                multi
                api={{
                  tenantFilter: currentTenant ? currentTenant.value : undefined,
                  url: "/api/ListGraphRequest",
                  dataKey: "Results",
                  labelField: (option) => `${option.displayName} (${option.userPrincipalName})`,
                  valueField: "id",
                  queryKey: "Offboarding-Users",
                  data: {
                    Endpoint: "users",
                    manualPagination: true,
                    $select: "id,userPrincipalName,displayName",
                    $count: true,
                    $orderby: "displayName",
                    $top: 999,
                  },
                }}
              />
              <CippFormComponent
                sx={{ m: 1 }}
                name="AccessAutomap"
                label="Grant Full Access (automap)"
                type="autoComplete"
                placeholder="Leave blank if not needed"
                formControl={formControl}
                multi
                api={{
                  labelField: (option) => `${option.displayName} (${option.userPrincipalName})`,
                  valueField: "id",
                  url: "/api/ListGraphRequest",
                  dataKey: "Results",
                  tenantFilter: currentTenant ? currentTenant.value : undefined,
                  queryKey: "Offboarding-Users",
                  data: {
                    Endpoint: "users",
                    manualPagination: true,
                    $select: "id,userPrincipalName,displayName",
                    $count: true,
                    $orderby: "displayName",
                    $top: 999,
                  },
                }}
              />
              <CippFormComponent
                sx={{ m: 1 }}
                name="OnedriveAccess"
                label="Grant Onedrive Full Access"
                type="autoComplete"
                placeholder="Leave blank if not needed"
                formControl={formControl}
                multi
                api={{
                  tenantFilter: currentTenant ? currentTenant.value : undefined,
                  labelField: (option) => `${option.displayName} (${option.userPrincipalName})`,
                  valueField: "id",
                  url: "/api/ListGraphRequest",
                  dataKey: "Results",
                  queryKey: "Offboarding-Users",
                  data: {
                    Endpoint: "users",
                    manualPagination: true,
                    $select: "id,userPrincipalName,displayName",
                    $count: true,
                    $orderby: "displayName",
                    $top: 999,
                  },
                }}
              />

              <Typography variant="subtitle2" sx={{ mt: 3 }} gutterBottom>
                Email Forwarding
              </Typography>
              <CippFormComponent
                name="disableForwarding"
                label="Disable Email Forwarding"
                type="switch"
                formControl={formControl}
              />

              <CippFormCondition
                formControl={formControl}
                field={"disableForwarding"}
                compareType="isNot"
                compareValue={true}
              >
                <CippFormComponent
                  sx={{ m: 1 }}
                  name="forward"
                  label="Forward Email To"
                  type="autoComplete"
                  placeholder="Leave blank if not needed"
                  formControl={formControl}
                  multiple={false}
                  api={{
                    tenantFilter: currentTenant ? currentTenant.value : undefined,
                    labelField: (option) => `${option.displayName} (${option.userPrincipalName})`,
                    valueField: "id",
                    url: "/api/ListGraphRequest",
                    dataKey: "Results",
                    queryKey: "Offboarding-Users",
                    data: {
                      Endpoint: "users",
                      manualPagination: true,
                      $select: "id,userPrincipalName,displayName",
                      $count: true,
                      $orderby: "displayName",
                      $top: 999,
                    },
                  }}
                />

                <CippFormComponent
                  name="KeepCopy"
                  label="Keep a copy of forwarded mail"
                  type="switch"
                  formControl={formControl}
                />
              </CippFormCondition>
              <CippFormComponent
                name="OOO"
                label="Out of Office Message"
                type="richText"
                placeholder="Leave blank to not set"
                fullWidth
                formControl={formControl}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {showAlert && (
        <Alert severity="warning">
          You have selected more than 2 users. This offboarding must be scheduled.
        </Alert>
      )}

      <Card variant="outlined">
        <CardHeader title="Scheduling & Notifications" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <CippFormComponent
                name="Scheduled.enabled"
                label="Schedule this offboarding"
                type="switch"
                formControl={formControl}
              />
            </Grid>

            <CippFormCondition
              formControl={formControl}
              field={"Scheduled.enabled"}
              compareType="is"
              compareValue={true}
            >
              <Grid size={{ sm: 6, xs: 12 }}>
                <Typography variant="subtitle2">Scheduled Offboarding Date</Typography>
                <CippFormComponent
                  name="Scheduled.date"
                  type="datePicker"
                  formControl={formControl}
                  fullWidth
                />
              </Grid>

              <Grid size={{ sm: 6, xs: 12 }}>
                <Typography variant="subtitle2">Send results to:</Typography>
                <CippFormComponent
                  name="postExecution.webhook"
                  label="Webhook"
                  type="switch"
                  formControl={formControl}
                />
                <CippFormComponent
                  name="postExecution.email"
                  label="E-mail"
                  type="switch"
                  formControl={formControl}
                />
                <CippFormComponent
                  name="postExecution.psa"
                  label="PSA"
                  type="switch"
                  formControl={formControl}
                />
              </Grid>
            </CippFormCondition>
          </Grid>
        </CardContent>
      </Card>

      <CippWizardStepButtons
        postUrl={postUrl}
        currentStep={currentStep}
        onPreviousStep={onPreviousStep}
        onNextStep={onNextStep}
        formControl={formControl}
        replacementBehaviour="removeNulls"
      />
    </Stack>
  );
};
