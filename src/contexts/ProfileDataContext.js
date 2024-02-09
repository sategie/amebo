import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { followHelper, unfollowHelper } from "../utils/utils";
import { useActiveUser } from "./ActiveUserContext";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    followedUsers: { results: [] },
  });

  const activeUser = useActiveUser

  const handleFollow = async(selectedProfile) => {
    try {
        const {data} = await axiosRes.post("/followers/", {
            followed_user: selectedProfile.id,
        });
        setProfileData((prevState) => ({
            ...prevState,
            pageProfile: {
              results: prevState.pageProfile.results.map((profile) =>
                followHelper(profile, selectedProfile, data.id)
              ),
            },
        
          }));
    

    } catch(err) {
        console.log(err)
    }
  }

  const handleUnfollow = async (selectedProfile) => {
    try {
      await axiosRes.delete(`/followers/${selectedProfile.following_id}/`);

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, selectedProfile)
          ),
        },
        followedUsers: { 
          // Update the followedUsers results to exclude the unfollowed profile
          results: prevState.followedUsers.results.filter(
            (profile) => profile.id !== selectedProfile.id
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };


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
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};