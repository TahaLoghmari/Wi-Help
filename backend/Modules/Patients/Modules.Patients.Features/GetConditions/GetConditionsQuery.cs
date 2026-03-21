using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.GetConditions;

public sealed record GetConditionsQuery : IQuery<List<ConditionDto>>;
