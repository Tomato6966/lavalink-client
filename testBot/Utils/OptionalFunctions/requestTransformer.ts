import { CustomRequester } from "../../types/Client";

// transform the requester user object to whatever you want so that you can have less memory usage
export const requesterTransformer = (requester: any): CustomRequester => {
    if (!requester) return { id: "unknown", username: "unknown", avatar: undefined };
    // if it's already the transformed requester
    if (typeof requester === "object" && "avatar" in requester && Object.keys(requester).length === 3) return requester as CustomRequester;
    // if it's still a discord.js User
    if (typeof requester === "object" && "displayAvatarURL" in requester) { // it's a user
        return {
            id: requester.id,
            username: requester.username,
            avatar: requester.displayAvatarURL(),
        }
    }
    if (typeof requester === "object") return { ...requester };
    // if it's non of the above
    return { id: requester!.toString(), username: "unknown" }; // reteurn something that makes sense for you!
};
