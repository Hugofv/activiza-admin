import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DefaultInputs from "../../components/form/formElements/DefaultInputs";
import InputGroup from "../../components/form/formElements/InputGroup";
import DropzoneComponent from "../../components/form/formElements/DropZone";
import CheckboxComponents from "../../components/form/formElements/CheckboxComponents";
import RadioButtons from "../../components/form/formElements/RadioButtons";
import ToggleSwitch from "../../components/form/formElements/ToggleSwitch";
import FileInputExample from "../../components/form/formElements/FileInputExample";
import SelectInputs from "../../components/form/formElements/SelectInputs";
import TextAreaInput from "../../components/form/formElements/TextAreaInput";
import InputStates from "../../components/form/formElements/InputStates";
import PageMeta from "../../components/common/PageMeta";

export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | Ativiza - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for Ativiza - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Form Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div>
      </div>
    </div>
  );
}
