package com.example.backend.exception;

import com.example.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

public class UserNotParticipantException extends RuntimeException {

  @AllArgsConstructor
  @Getter
  public enum UserNotParticipantExceptionCodes {
      CANT_UPLOAD("Can't upload attachment"), CANT_RETRIEVE("Can't retrieve attachment"),
      CANT_DELETE("Can't delete attachment");

      private final String message;
  }

    private static final String MESSAGE = ", User %s is not a participant of the trip";

    public UserNotParticipantException(final User user, final UserNotParticipantExceptionCodes code) {
        super(String.format(code.getMessage() + MESSAGE, user.getNickname()));
    }
}
