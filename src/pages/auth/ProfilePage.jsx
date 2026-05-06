import DynamicForm from "../../components/Forms/DynamicForm";
import Modal from "../../components/models/Modal";
import { useAuth } from "./hooks/authHooks";
import toast from "../../components/toast/toast";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, selectModal } from "../../redux/ui/uiSlice";

const ProfilePage = ({darkMode}) => {
  const { user, isUpdatingProfile, updateProfile } = useAuth();
  const dispatch   = useDispatch();
  const isModalOpen = useSelector(selectModal('profile'));

  const profileFields = [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'First Name',
      helperText: 'The first name associated with this account',
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Last Name',
      helperText: 'The last name associated with this account',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      isEditable: false,
      placeholder: 'Email',
      helperText: 'The email address associated with this account',
    },
  ];

  const handleSubmit = async (data) => {
    const result = await updateProfile(user.id, data);
    if (result.success === false) {
      toast.error(result.error);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => dispatch(closeModal('profile'))}
      title="Edit Profile"
      darkMode={darkMode}          // ← passed through
    >
      <div className="p-6">
        <DynamicForm
          fields={profileFields}
          onSubmit={handleSubmit}
          isLoading={isUpdatingProfile}
          submitText="Save"
          initialValues={{
            first_name: user.first_name,
            last_name:  user.last_name,
            email:      user.email,
          }}
          disableSubmitIfUnchanged={true}
          buttonSize="auto"
          buttonAlignment="end"
          darkMode={darkMode}
        />
      </div>
    </Modal>
  );
};

export default ProfilePage;