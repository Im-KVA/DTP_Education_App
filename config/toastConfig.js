import { ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  error: (props) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={2}
      text2NumberOfLines={5}
      text2Style={{ fontSize: 12, flexWrap: "wrap" }}
    />
  ),
};
