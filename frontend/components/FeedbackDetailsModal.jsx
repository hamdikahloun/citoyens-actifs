import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "@/theme/colors";
import { Feedback } from "@/api/Feedback";
import { updateFeedback } from "@/reducers/feedbackSlice";
import { useDispatch, useSelector } from "react-redux";

const FeedbackDetailsModal = ({ id, onClose }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const feedback = useSelector((state) =>
    state.feedback.items.find((item) => item._id === id),
  );
  const user = useSelector((state) => state.user);

  if (!feedback) return null;

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const updatedFeedback = await Feedback.addComment(
        feedback._id,
        comment.trim(),
      );
      dispatch(updateFeedback(updatedFeedback));
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Erreur", "Impossible d'ajouter le commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updatedFeedback = await Feedback.updateStatus(
        feedback._id,
        newStatus,
      );
      dispatch(updateFeedback(updatedFeedback));
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour le statut");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const canUpdateStatus =
    user?.role === "admin" ||
    user?.role === "public_service" ||
    user?._id === feedback.user._id;

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{feedback.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {canUpdateStatus && (
              <View style={styles.statusSection}>
                <Text style={styles.statusLabel}>Statut:</Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      feedback.status === "pending" &&
                        styles.statusButtonActive,
                    ]}
                    onPress={() => handleUpdateStatus("pending")}
                    disabled={isUpdatingStatus}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        feedback.status === "pending" &&
                          styles.statusButtonTextActive,
                      ]}
                    >
                      En attente
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      feedback.status === "in_progress" &&
                        styles.statusButtonActive,
                    ]}
                    onPress={() => handleUpdateStatus("in_progress")}
                    disabled={isUpdatingStatus}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        feedback.status === "in_progress" &&
                          styles.statusButtonTextActive,
                      ]}
                    >
                      En cours
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      feedback.status === "done" && styles.statusButtonActive,
                    ]}
                    onPress={() => handleUpdateStatus("done")}
                    disabled={isUpdatingStatus}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        feedback.status === "done" &&
                          styles.statusButtonTextActive,
                      ]}
                    >
                      Terminé
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {feedback.image?.url && (
              <Image
                source={{ uri: feedback.image.url }}
                style={styles.feedbackImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.feedbackDescription}>
              {feedback.description}
            </Text>
            <View style={styles.feedbackInfo}>
              <Text style={styles.feedbackDate}>
                {new Date(feedback.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.feedbackAddress}>{feedback.address}</Text>
            </View>
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Commentaires</Text>
              {feedback.comments.length > 0 ? (
                feedback.comments.map((comment, index) => (
                  <View key={index} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>
                        {comment.user.name}
                      </Text>
                      <Text style={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.message}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noComments}>Aucun commentaire</Text>
              )}
            </View>
          </ScrollView>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Ajouter un commentaire..."
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                !comment.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitComment}
              disabled={!comment.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <MaterialCommunityIcons
                  name="send"
                  size={24}
                  color={colors.background}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    flexGrow: 1,
  },
  feedbackImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  feedbackDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  feedbackInfo: {
    marginBottom: 16,
  },
  feedbackDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  feedbackAddress: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  commentsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  commentItem: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
  },
  commentDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  noComments: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: colors.text,
    maxHeight: 100,
  },
  submitButton: {
    backgroundColor: colors.button,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  statusSection: {
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.secondaryButton,
    borderWidth: 1,
  },
  statusButtonActive: {
    backgroundColor: colors.button,
  },
  statusButtonText: {
    color: colors.secondaryButtonText,
    fontSize: 14,
  },
  statusButtonTextActive: {
    color: colors.buttonText,
  },
});

export default FeedbackDetailsModal;
