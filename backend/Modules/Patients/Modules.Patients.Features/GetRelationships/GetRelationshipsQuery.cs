using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.GetRelationships;

public sealed record GetRelationshipsQuery : IQuery<List<RelationshipDto>>;
