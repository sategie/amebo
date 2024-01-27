import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useActiveUser } from "./ActiveUserContext";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // we will use the pageProfile later!
    pageProfile: { results: [] },
  });

  const activeUser = useActiveUser

  const handleFollow = async(selectedProfile) => {
    try {
        const {data} = await axiosRes.post("/followers/", {
            followed_user: selectedProfile.id,
        });

    } catch(err) {
        console.log(err)
    }
  }

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          mainProfile: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [activeUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={{ setProfileData, handleFollow }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};