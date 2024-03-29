import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, curr) => {
        return acc.some((accResult) => accResult.id === curr.id)
          ? acc
          : [...acc, curr];
      }, prevResource.results),
    }));
  } catch (err) {}
};

export const followHelper = (profile, selectedProfile, following_id) => {
  return profile.id === selectedProfile.id
    ? // This is the profile I clicked on,
      // update its followers count and set its following id
      {
        ...profile,
        followers_count: profile.followers_count + 1,
        following_id,
      }
    : profile.own_profile
    ? // This is the profile of the logged in user
      // update its following count
      { ...profile, following_count: profile.following_count + 1 }
    : // this is not the profile the user clicked on or the profile
      // the user owns, so just return it unchanged
      profile;
};

export const unfollowHelper = (profile, selectedProfile) => {
    return profile.id === selectedProfile.id
      ? // This is the profile I clicked on,
        // update its followers count and set its following id
        {
          ...profile,
          followers_count: profile.followers_count - 1,
          following_id: null,
        }
      : profile.own_profile
      ? // This is the profile of the logged in user
        // update its following count
        { ...profile, following_count: profile.following_count - 1 }
      : // this is not the profile the user clicked on or the profile
        // the user owns, so just return it unchanged
        profile;
  };