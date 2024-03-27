import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { PasswordForm } from "./PasswordForm.js";
import { loginUser, resendMfaCode } from "../../services/loginService.js";
import { PAGES } from "@ente/accounts/constants/pages.js";
import { useUser } from "../../hooks/accountHooks/index.js";

type FormValues = {
  email: string;
};

export const MfaForm = () => {
  const { push } = useNavigation();
  const user = useUser();
  const { handleSubmit } = useForm<FormValues>({
    async onSubmit(values) {
      const { nextAction } = await loginUser(values.email);
      if (nextAction === PAGES.VERIFY) {
        push(<MfaForm />);
      } else {
        push(<PasswordForm />);
      }
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
          <Action
            title="Re-send code"
            icon={Icon.AirplaneTakeoff}
            onAction={async () => {
              await resendMfaCode();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="mfacode"
        title="MFA CODE"
        info="Sent code to your email. Please check mailbox."
        storeValue={false}
      />
    </Form>
  );
};
